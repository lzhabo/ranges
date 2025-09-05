import { makeAutoObservable, reaction, runInAction } from "mobx";

import { fetchAllBalances, PortfolioBalances, TokenBalance } from "../utils/portfolioFetcher";
import RootStore from "./RootStore";

class BalanceStore {
  public readonly rootStore: RootStore;
  portfolioBalances: PortfolioBalances = {};
  prices: Record<string, number> = {};
  initialized: boolean = false;

  constructor(rootStore: RootStore) {
    console.log("BalanceStore constructor");
    this.rootStore = rootStore;
    makeAutoObservable(this);

    reaction(
      () => [rootStore.accountStore.address, rootStore.accountStore.chainId],
      () =>
        Promise.all([
          this.updateTokenBalances(),
        ]).then(() => this.setInitialized(true)),
      { fireImmediately: true }
    );

    setTimeout(() => this.updateTokenBalances(), 1000);
    setInterval(() => this.updateTokenBalances(), 30000);

  }

  get balances(): Record<string, TokenBalance> {
    const chainId = this.rootStore.accountStore.chainId;
    if (!chainId) return {};
    const result: Record<string, TokenBalance> = {};

    const tokenBalances = this.portfolioBalances[chainId]?.tokenBalances || [];
    tokenBalances.forEach((token) => (result[token.symbol] = token));

    const nativeBalance = this.portfolioBalances[chainId]?.nativeBalance;
    nativeBalance && (result[nativeBalance.symbol] = nativeBalance);

    const zxBalance = this.portfolioBalances[chainId]?.zxBalance;
    zxBalance && (result[zxBalance.symbol] = zxBalance);

    return result;
  }

  setInitialized = (initialized: boolean) => (this.initialized = initialized);

  updateTokenBalances = async () => {
    const { address } = this.rootStore.accountStore;
    if (!address) return;

    try {
      // Получаем балансы для всех сетей
      const portfolioBalances = await fetchAllBalances(address);
      console.log(portfolioBalances);
      // Форматируем для совместимости с текущим store
      // const formattedBalances = formatBalancesForStore(portfolioBalances);

      runInAction(() => {
        this.portfolioBalances = portfolioBalances;
      });
    } catch (error) {
      console.error("Error fetching portfolio balances:", error);

      // Fallback к старому методу для текущей сети
      // await this.updateSingleChainBalances();
    }
  };

}


export default BalanceStore;
