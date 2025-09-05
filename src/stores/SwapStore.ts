import { makeAutoObservable } from "mobx";
import {
  COINS,
  NETWORKS
} from "../configs/networkConfig";
import BN from "../utils/BN";
import RootStore from "./RootStore";

export type IPresaleStoreInitState = {
  payToken: COINS;
};

class PresaleStore {
  public readonly rootStore: RootStore;

  userError: string | null = null; // Пользовательские ошибки
  payToken: COINS = COINS.ETH;
  buyToken: COINS = COINS.ETH;
  payAmount: BN = BN.ZERO;
  buyAmount: BN = BN.ZERO;


  constructor(rootStore: RootStore, initialState?: IPresaleStoreInitState) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setError = (errorMessage: string) => {
    this.userError = errorMessage;
  };

  clearError = () => {
    this.userError = null;
  };

  get balanceZX() {
    // Собираем сумму баланса ZX по всем сетям
    const allBalances = this.rootStore.balanceStore.portfolioBalances;
    let sum = BN.ZERO;
    for (const chainId in allBalances) {
      const zxBalance = allBalances[chainId]?.zxBalance?.balance;
      if (zxBalance) {
        sum = sum.plus(zxBalance);
      }
    }
    return sum;
  }

  // Геттеры для удобства

  setPayToken = (v: COINS) => {
    this.payToken = v;
  };

  setPayAmount = (v: BN) => {
    this.payAmount = v.isNaN() ? BN.ZERO : v;
  };

  setBuyAmount = (v: BN) => {
    this.buyAmount = v.isNaN() ? BN.ZERO : v;
  };

  setSelectedNetwork = (network: NETWORKS) => {

  };


}
export default PresaleStore;
