
export enum NETWORKS {
  SEPOLIA = "sepolia",
}

export enum COINS {
  ETH = "ETH",
  USDT = "USDT",
  USDC = "USDC",
  LIDA = "LIDA",
  VOVA = "VOVA",
}


export enum PRICE_FEEDS {
  ETH = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
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
  explorer: string;
  title: string;
  tokens: TokenConfig[];
};


export const NetworkConfig: Record<string, NetworkConfig> = {
  sepolia: {
    name: NETWORKS.SEPOLIA,
    chainId: 11155111,
    contract: "0x86D7Dc8807C1C24b49684104D63a7d009Ccd4Cca",
    rpc: "https://ethereum-sepolia.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
    title: "Ethereum Sepolia",
    tokens: [
      {
        symbol: COINS.ETH,
        decimals: 18,
        isNative: true,
      },
      {
        symbol: COINS.LIDA,
        decimals: 18,
        address: "0x6778CbA88EDd82244363fd8c77dA539b72f79a9b",
      },
      {
        symbol: COINS.VOVA,
        decimals: 18,
        address: "0xdFa4A4E342E43bd85c7E7Fe4d4114fEC11DebF0D",
      },
    ],
  },
};
