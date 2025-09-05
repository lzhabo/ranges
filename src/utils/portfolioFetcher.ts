import { createPublicClient, http, type Address, type Chain } from "viem";
import { mainnet, polygon, bsc, arbitrum, base, sepolia } from "wagmi/chains";
import { NetworkConfig } from "../configs/networkConfig";
import BN from "./BN";

// Типы из networkConfig
type TokenConfig = {
  symbol: string;
  decimals: number;
  address?: `0x${string}`;
  isNative?: boolean;
};

type NetworkConfigType = {
  name: string;
  chainId: number;
  contract: `0x${string}`;
  rpc: string;
  testnet?: boolean;
  sellTokens: TokenConfig[];
  buyToken: TokenConfig;
  explorer: string;
  title: string;
  logo: string;
  type: string;
};

// Минимальный ABI для ERC-20 токенов
const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ABI для кастомного контракта (sellToken)
const CUSTOM_TOKEN_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface TokenBalance {
  symbol: string;
  balance: number;
  decimals: number;
  address?: `0x${string}`;
  isNative?: boolean;
  chainId: number;
  chainName: string;
}

export interface PortfolioBalances {
  [chainId: number]: {
    chainName: string;
    nativeBalance: TokenBalance;
    tokenBalances: TokenBalance[];
    zxBalance?: TokenBalance;
  };
}


// Создание клиента для конкретной сети
function createChainClient(chainId: number, rpcUrl: string) {
  const chain: Chain = {
    id: chainId,
    name: getChainName(chainId),
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [rpcUrl] } },
  };

  return createPublicClient({
    chain,
    transport: http(),
  });
}

function getChainName(chainId: number): string {
  switch (chainId) {
    case mainnet.id:
      return "Ethereum";
    case polygon.id:
      return "Polygon";
    case bsc.id:
      return "BNB Chain";
    case arbitrum.id:
      return "Arbitrum";
    case base.id:
      return "Base";
    case sepolia.id:
      return "Sepolia";
    default:
      return "Unknown";
  }
}

// Получение всех токенов для сети
function getTokensForChain(networkConfig: NetworkConfigType) {
  const { sellTokens, buyToken } = networkConfig;
  const allTokens = [...sellTokens, buyToken];

  return {
    nativeToken: sellTokens.find((token) => token.isNative),
    erc20Tokens: allTokens.filter((token) => !token.isNative && token.address),
    customToken: buyToken, // sellToken (кастомный контракт)
  };
}

// Получение балансов для одной сети
async function fetchChainBalances(
  chainId: number,
  address: Address,
  networkConfig: NetworkConfigType
): Promise<PortfolioBalances[number] | null> {
  try {
    const rpcUrl = networkConfig.rpc;
    if (!rpcUrl) {
      console.warn(`No RPC configured for chain ${chainId}`);
      return null;
    }

    const client = createChainClient(chainId, rpcUrl);
    const { nativeToken, erc20Tokens, customToken } =
      getTokensForChain(networkConfig);

    // Получаем нативный баланс
    const nativeBalance = await client.getBalance({ address });

    // Подготавливаем контракты для мультиколла
    const contracts = [];

    // ERC-20 токены
    for (const token of erc20Tokens) {
      if (token.address) {
        contracts.push({
          address: token.address,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        });
      }
    }

    // Кастомный токен (sellToken)
    if (customToken.address) {
      contracts.push({
        address: customToken.address,
        abi: CUSTOM_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      });
    }

    // Выполняем мультиколл
    let multicallResults: any[] = [];
    if (contracts.length > 0) {
      try {
        multicallResults = await client.multicall({
          contracts,
          allowFailure: true,
        });
      } catch (error) {
        console.warn(
          `Multicall failed for chain ${chainId}, fetching individually:`,
          error
        );

        // Fallback: получаем балансы по одному
        multicallResults = await Promise.all(
          contracts.map(async (contract) => {
            try {
              const result = await client.readContract({
                address: contract.address,
                abi: contract.abi,
                functionName: "balanceOf" as const,
                args: contract.args as [`0x${string}`],
              });
              return { status: "success", result };
            } catch (err) {
              console.error(
                `Error fetching balance for ${contract.address}:`,
                err
              );
              return { status: "failure", result: 0 };
            }
          })
        );
      }
    }

    // Обрабатываем результаты
    const tokenBalances: TokenBalance[] = [];
    let zxBalance: TokenBalance | undefined;

    // Обрабатываем ERC-20 токены
    for (let i = 0; i < erc20Tokens.length; i++) {
      const token = erc20Tokens[i];
      const result = multicallResults[i];

      if (token.address && result?.status === "success") {
        const balance = BN.formatUnits(
          result.result,
          token.decimals
        ).toNumber();
        tokenBalances.push({
          symbol: token.symbol,
          balance,
          decimals: token.decimals,
          address: token.address,
          isNative: false,
          chainId,
          chainName: getChainName(chainId),
        });
      }
    }

    // Обрабатываем кастомный токен
    if (customToken.address) {
      const customResult = multicallResults[erc20Tokens.length];
      if (customResult?.status === "success") {
        const balance = BN.formatUnits(
          customResult.result,
          customToken.decimals
        ).toNumber();
        zxBalance = {
          symbol: customToken.symbol,
          balance,
          decimals: customToken.decimals,
          address: customToken.address,
          isNative: false,
          chainId,
          chainName: getChainName(chainId),
        };
      }
    }

    // Нативный токен
    const nativeBalanceFormatted: TokenBalance = {
      symbol: nativeToken?.symbol || "ETH",
      balance: BN.formatUnits(
        nativeBalance,
        nativeToken?.decimals || 18
      ).toNumber(),
      decimals: nativeToken?.decimals || 18,
      isNative: true,
      chainId,
      chainName: getChainName(chainId),
    };

    return {
      chainName: getChainName(chainId),
      nativeBalance: nativeBalanceFormatted,
      tokenBalances,
      zxBalance,
    };
  } catch (error) {
    console.error(`Error fetching balances for chain ${chainId}:`, error);
    return null;
  }
}

// Основная функция для получения всех балансов
export async function fetchAllBalances(
  address: Address
): Promise<PortfolioBalances> {
  const supportedChains = [
    mainnet.id,
    polygon.id,
    bsc.id,
    arbitrum.id,
    base.id,
    sepolia.id,
  ];
  const results: PortfolioBalances = {};

  // Получаем балансы для всех сетей параллельно
  const promises = supportedChains.map(async (chainId) => {
    const networkKey = Object.keys(NetworkConfig).find(
      (key) =>
        NetworkConfig[key as keyof typeof NetworkConfig].chainId === chainId
    );

    if (!networkKey) {
      console.warn(`No network config found for chain ${chainId}`);
      return;
    }

    const networkConfig =
      NetworkConfig[networkKey as keyof typeof NetworkConfig];
    const chainBalances = await fetchChainBalances(
      chainId,
      address,
    );

    if (chainBalances) {
      results[chainId] = chainBalances;
    }
  });

  await Promise.allSettled(promises);
  return results;
}

// Функция для получения балансов только для одной сети (для обратной совместимости)
export async function fetchSingleChainBalances(
  chainId: number,
  address: Address,
  networkConfig: NetworkConfigType
): Promise<PortfolioBalances[number] | null> {
  return fetchChainBalances(chainId, address, networkConfig);
}

// Утилита для форматирования балансов в удобный формат
export function formatBalancesForStore(
  portfolioBalances: PortfolioBalances
): Record<string, any> {
  const formatted: Record<string, any> = {};

  Object.values(portfolioBalances).forEach((chainData) => {
    // Добавляем нативный баланс
    if (chainData.nativeBalance) {
      formatted[chainData.nativeBalance.symbol] = {
        balance: chainData.nativeBalance.balance,
        decimals: chainData.nativeBalance.decimals,
        isNative: chainData.nativeBalance.isNative,
        symbol: chainData.nativeBalance.symbol,
        chainId: chainData.nativeBalance.chainId,
        chainName: chainData.nativeBalance.chainName,
      };
    }

    // Добавляем ERC-20 токены
    chainData.tokenBalances.forEach((token: TokenBalance) => {
      formatted[token.symbol] = {
        balance: token.balance,
        decimals: token.decimals,
        address: token.address,
        isNative: token.isNative,
        symbol: token.symbol,
        chainId: token.chainId,
        chainName: token.chainName,
      };
    });

    // Добавляем кастомный токен
    if (chainData.zxBalance) {
      formatted[chainData.zxBalance.symbol] = {
        balance: chainData.zxBalance.balance,
        decimals: chainData.zxBalance.decimals,
        address: chainData.zxBalance.address,
        isNative: chainData.zxBalance.isNative,
        symbol: chainData.zxBalance.symbol,
        chainId: chainData.zxBalance.chainId,
        chainName: chainData.zxBalance.chainName,
      };
    }
  });

  return formatted;
}

/*
==================== Пример использования ====================

import { fetchAllBalances, formatBalancesForStore } from './portfolioFetcher';

// Получение всех балансов для адреса
async function getPortfolioBalances(address: `0x${string}`) {
  try {
    // Получаем балансы для всех сетей параллельно
    const portfolioBalances = await fetchAllBalances(address);
    
    console.log('Portfolio balances:', portfolioBalances);
    
    // Форматируем для использования в store
    const formattedBalances = formatBalancesForStore(portfolioBalances);
    
    console.log('Formatted balances:', formattedBalances);
    
    return formattedBalances;
  } catch (error) {
    console.error('Error fetching portfolio balances:', error);
    return {};
  }
}

// Пример вызова
const address = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
getPortfolioBalances(address);

==================== Структура возвращаемых данных ====================

PortfolioBalances {
  [1]: { // Ethereum Mainnet
    chainName: "Ethereum",
    nativeBalance: {
      symbol: "ETH",
      balance: 0.5,
      decimals: 18,
      isNative: true,
      chainId: 1,
      chainName: "Ethereum"
    },
    tokenBalances: [
      {
        symbol: "USDT",
        balance: 1000,
        decimals: 6,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        isNative: false,
        chainId: 1,
        chainName: "Ethereum"
      }
    ],
    zxBalance: {
      symbol: "ZX",
      balance: 500,
      decimals: 18,
      address: "0xFBB8646D516c9B089bFaAC605A7B63E334172aeC",
      isNative: false,
      chainId: 1,
      chainName: "Ethereum"
    }
  },
  [137]: { // Polygon
    chainName: "Polygon",
    nativeBalance: { ... },
    tokenBalances: [ ... ],
    zxBalance: { ... }
  }
  // ... другие сети
}

==================== Особенности ====================

1. Мультиколл: Используется для оптимизации запросов к RPC
2. Fallback: При ошибке мультиколла используется индивидуальные запросы
3. Параллельная обработка: Все сети обрабатываются одновременно
4. Обработка ошибок: Каждая сеть обрабатывается независимо
5. Типизация: Полная типизация TypeScript для всех данных

*/
