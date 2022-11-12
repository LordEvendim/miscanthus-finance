interface NetworkDetails {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export enum AvailableNetworks {
  LOCAL = "local",
  TRON = "tron",
  TRON_TESTNET = "tronTestnet",
}

export const currentNetwork: AvailableNetworks =
  process.env.NODE_ENV === "development"
    ? AvailableNetworks.TRON_TESTNET
    : AvailableNetworks.TRON_TESTNET;

export const networks: { [network in AvailableNetworks]: NetworkDetails } = {
  local: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "Localhost 8545",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://localhost:8545"],
    blockExplorerUrls: ["https://explorer.thetatoken.org"],
  },
  tron: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "Localhost 8545",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://localhost:8545"],
    blockExplorerUrls: ["https://explorer.thetatoken.org"],
  },
  tronTestnet: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "Localhost 8545",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://localhost:8545"],
    blockExplorerUrls: ["https://explorer.thetatoken.org"],
  },
};
