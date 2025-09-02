
export enum NETWORKS {
  SEPOLIA = "sepolia",
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
  BSC = "bsc",
  ARBITRUM = "arbitrum",
  BASE = "base",
  SOLANA = "solana",
  TRON = "tron",
  TON = "ton",
  CARD = "card",
}

export enum COINS {
  ETH = "ETH",
  USDT = "USDT",
  USDC = "USDC",
  POL = "POL",
  DAI = "DAI",
  TRX = "TRX",
  TON = "TON",
  SOL = "SOL",
  BNB = "BNB",
  ZX = "ZX",
  USD = "USD",
}


export enum PRICE_FEEDS {
  ETH = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  SOL = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  TON = "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026",
  TRX = "0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b",
  USDT = "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  USDC = "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  USD = "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  DAI = "0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd",
  POL = "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472",
  BNB = "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
}

type TokenConfig = {
  symbol: COINS;
  decimals: number;
  address?: `0x${string}`;
  isNative?: boolean;
  // Removed priceFeed field
};

type NetworkConfig = {
  name: NETWORKS;
  chainId: number;
  contract: `0x${string}`;
  rpc: string;
  testnet?: boolean;
  sellTokens: TokenConfig[]; // Renamed from tokens
  buyToken: TokenConfig; // New field for buyToken
  explorer: string;
  title: string;
  type: PAYMENT_TYPES;
};

export enum PAYMENT_TYPES {
  EVM = "evm",
  QR_PAYMENT = "qr_payment",
  LINK_PAYMENT = "link_payment",
}

export const NetworkConfig: Record<string, NetworkConfig> = {
  ethereum: {
    name: NETWORKS.ETHEREUM,
    chainId: 1,
    contract: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    rpc: "https://ethereum.publicnode.com",
    explorer: "https://etherscan.io",
    sellTokens: [
      {
        symbol: COINS.ETH,
        decimals: 18,
        isNative: true,
      },
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      {
        symbol: COINS.DAI,
        decimals: 6,
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      },
    ],
    buyToken: {
      symbol: COINS.ZX,
      decimals: 18,
      address: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    },
    type: PAYMENT_TYPES.EVM,
    title: "Ethereum",
  },

  polygon: {
    name: NETWORKS.POLYGON,
    chainId: 137,
    contract: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    rpc: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    sellTokens: [
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      },
      {
        symbol: COINS.POL,
        decimals: 18,
        isNative: true,
      },
    ],
    buyToken: {
      symbol: COINS.ZX,
      decimals: 18,
      address: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    },
    type: PAYMENT_TYPES.EVM,
    title: "Polygon Mainnet",
  },
  bsc: {
    name: NETWORKS.BSC,
    chainId: 56,
    contract: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com",
    sellTokens: [
      {
        symbol: COINS.BNB,
        decimals: 18,
        isNative: true,
      },
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0x55d398326f99059fF775485246999027B3197955",
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      },
    ],
    buyToken: {
      symbol: COINS.ZX,
      decimals: 18,
      address: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    },
    type: PAYMENT_TYPES.EVM,
    title: "BNB Chain",
  },
  arbitrum: {
    name: NETWORKS.ARBITRUM,
    chainId: 42161,
    contract: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    sellTokens: [
      {
        symbol: COINS.ETH,
        decimals: 18,
        isNative: true,
      },
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
    ],
    buyToken: {
      symbol: COINS.ZX,
      decimals: 18,
      address: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    },
    type: PAYMENT_TYPES.EVM,
    title: "Arbitrum One",
  },
  base: {
    name: NETWORKS.BASE,
    chainId: 8453,
    contract: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    rpc: "https://base.drpc.org",
    explorer: "https://basescan.org",
    sellTokens: [
      {
        symbol: COINS.ETH,
        decimals: 18,
        isNative: true,
      },
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
    ],
    buyToken: {
      symbol: COINS.ZX,
      decimals: 18,
      address: "0x4505143cC5A23e0CC674E53D9f620df2B60C6c7F",
    },
    type: PAYMENT_TYPES.EVM,
    title: "Base Mainnet",
  },
  // solana: {
  //   name: NETWORKS.SOLANA,
  //   chainId: 0, // Solana doesn't use chainId
  //   contract: "0x0000000000000000000000000000000000000000",
  //   rpc: "https://api.mainnet-beta.solana.com",
  //   explorer: "https://explorer.solana.com",
  //   sellTokens: [
  //     {
  //       symbol: COINS.SOL,
  //       decimals: 9,
  //       isNative: true,
  //     },
  //     {
  //       symbol: COINS.USDT,
  //       decimals: 6,
  //     },
  //     {
  //       symbol: COINS.USDC,
  //       decimals: 6,
  //     },
  //   ],
  //   buyToken: {
  //     symbol: COINS.ZX,
  //     decimals: 18,
  //     address: "0xYourZXTokenAddress",
  //   },
  //   type: PAYMENT_TYPES.QR_PAYMENT,
  //   title: "Solana Mainnet",
  //   logo: solanaLogo,
  // },
  // tron: {
  //   name: NETWORKS.TRON,
  //   chainId: 0, // Tron doesn't use chainId
  //   contract: "0x0000000000000000000000000000000000000000",
  //   rpc: "https://api.trongrid.io",
  //   explorer: "https://tronscan.org",
  //   sellTokens: [
  //     {
  //       symbol: COINS.TRX,
  //       decimals: 6,
  //       isNative: true,
  //     },
  //     {
  //       symbol: COINS.USDT,
  //       decimals: 6,
  //     },
  //   ],
  //   buyToken: {
  //     symbol: COINS.ZX,
  //     decimals: 18,
  //     address: "0xYourZXTokenAddress",
  //   },
  //   type: PAYMENT_TYPES.QR_PAYMENT,
  //   title: "Tron Mainnet",
  //   logo: tronLogo,
  // },
  // ton: {
  //   name: NETWORKS.TON,
  //   chainId: 0, // Ton doesn't use chainId
  //   contract: "0x0000000000000000000000000000000000000000",
  //   rpc: "https://toncenter.com/api/v2/jsonRPC",
  //   explorer: "https://tonscan.org",
  //   sellTokens: [
  //     {
  //       symbol: COINS.TON,
  //       decimals: 9,
  //       isNative: true,
  //     },
  //     {
  //       symbol: COINS.USDT,
  //       decimals: 6,
  //     },
  //   ],
  //   buyToken: {
  //     symbol: COINS.ZX,
  //     decimals: 18,
  //     address: "0xYourZXTokenAddress",
  //   },
  //   type: PAYMENT_TYPES.QR_PAYMENT,
  //   title: "Ton Mainnet",
  //   logo: tonLogo,
  // },
  // card: {
  //   name: NETWORKS.CARD,
  //   chainId: 0, // Not applicable
  //   contract: "0x0000000000000000000000000000000000000000",
  //   rpc: "",
  //   explorer: "",
  //   sellTokens: [
  //     {
  //       symbol: COINS.USD,
  //       decimals: 2,
        
  //     },
  //   ],
  //   buyToken: {
  //     symbol: COINS.ZX,
  //     decimals: 18,
  //     address: "0xYourZXTokenAddress",
  //   },
  //   type: PAYMENT_TYPES.LINK_PAYMENT,
  //   title: "Visa/Mastercard",
  //   logo: cardLogo,
  // },
  sepolia: {
    name: NETWORKS.SEPOLIA,
    chainId: 11155111,
    contract: "0x86D7Dc8807C1C24b49684104D63a7d009Ccd4Cca",
    rpc: "https://ethereum-sepolia.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
    sellTokens: [
      {
        symbol: COINS.ETH,
        decimals: 18,
        isNative: true,
        // Removed priceFeed
      },
      {
        symbol: COINS.USDT,
        decimals: 6,
        address: "0x622fd0b24B14Fb76d27d8616a96ECbd05fC27527",
        // Removed priceFeed
      },
      {
        symbol: COINS.USDC,
        decimals: 6,
        address: "0xd6F4D4e0550622C8165106F81aaCeB0084ac78Ad",
        // Removed priceFeed
      },
    ],
    buyToken: {
      symbol: COINS.ZX,
      decimals: 18,
      address: "0x86D7Dc8807C1C24b49684104D63a7d009Ccd4Cca",
    },
    type: PAYMENT_TYPES.EVM,
    title: "Ethereum Sepolia",
  },
};
