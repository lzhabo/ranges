import { makeAutoObservable, reaction } from "mobx";
import type { Config } from "wagmi";
import RootStore from "./RootStore";


export interface IAccountStoreInitState {}

class AccountStore {
  public readonly rootStore: RootStore;
  address?: `0x${string}`;
  isConnected: boolean = false;
  isProcessing: boolean = false;
  chainId: number | null = null;
  wagmiConfig: Config | null = null;

  isAuthenticating: boolean = false;
  signatures: Record<string, string> = {};

  isLoading: boolean = false;

  constructor(rootStore: RootStore, initState?: IAccountStoreInitState) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    if (initState != null) {
      //todo
    }

    // reaction(
    //   () => this.chainId,
    //   () => {
    //     const network = this.networkConfig?.name;
    //     network && this.rootStore.presaleStore.setSelectedNetwork(network);
    //   }
    // );
  }

  setAddress = (address?: `0x${string}`) => {
    // this.address = address;
    // // Сбрасываем состояние подключения когда адрес меняется
    // if (address) {
    //   this.rootStore.presaleStore.setFormStatus("idle");
    //   // Отправляем запрос на подключение кошелька
    //   this.sendWalletConnectRequest(address);
    // }
  };

  sendWalletConnectRequest = async (walletAddress: string) => {
    try {
      // await analyticsApi.connectWallet(walletAddress);
      // console.log("Wallet connect request sent successfully");
    } catch (error) {
      console.error("Failed to send wallet connect request:", error);
      // Не блокируем основной функционал при ошибке API
    }
  };
  setIsConnected = (isConnected: boolean) => (this.isConnected = isConnected);
  setChainId = (chainId: number | null) => (this.chainId = chainId);
  setWagmiConfig = (config: Config) => (this.wagmiConfig = config);
  setLoading = (loading: boolean) => (this.isLoading = loading);

  // get networkConfig() {
  //   const selectedNetwork = this.rootStore.presaleStore.selectedNetwork;
  //   const networkConfig = NetworkConfig[selectedNetwork];
  //   return networkConfig.chainId === 0
  //     ? networkConfig
  //     : Object.values(NetworkConfig).find(
  //         (network) => network.chainId === this.chainId
  //       );
  // }

  get formatAddress() {
    if (!this.address) return "";
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  }

  serialize = () => {
    //todo
    return {};
  };
}

export default AccountStore;
