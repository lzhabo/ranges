import { makeAutoObservable } from "mobx";
import AccountStore, { type IAccountStoreInitState } from "./AccountStore";

export interface ISerializedRootStore {
  accountStore?: IAccountStoreInitState;
}

export default class RootStore {
  accountStore: AccountStore;
  
  constructor(initialState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this, initialState?.accountStore);
    makeAutoObservable(this);

  }

  serialize = (): ISerializedRootStore => ({
    accountStore: this.accountStore.serialize(),
  });
}
