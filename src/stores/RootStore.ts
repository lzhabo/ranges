import { makeAutoObservable } from "mobx";
import AccountStore, { type IAccountStoreInitState } from "./AccountStore";
import BalanceStore from "./BalanceStore";
import SwapStore from "./SwapStore";

export interface ISerializedRootStore {
  accountStore?: IAccountStoreInitState;
}

export default class RootStore {
  accountStore: AccountStore;
  balanceStore: BalanceStore;
  swapStore: SwapStore;

  constructor(initialState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this);
    this.balanceStore = new BalanceStore(this)
    this.swapStore = new SwapStore(this);
    makeAutoObservable(this);

  }

  serialize = (): ISerializedRootStore => ({
    accountStore: this.accountStore.serialize(),
  });
}
