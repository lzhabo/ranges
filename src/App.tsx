import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAccount, useChainId, useConfig, WagmiProvider } from "wagmi";
import RootStore from "./stores/RootStore";
import wagmiConfig from "./configs/wagmiConfig";
import { storesContext, useStores } from "./stores/useStores";
import Swap from "./pages/Swap";

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

function AppRoutes() {
  return (
    <Wrapper>
      <Swap />
    </Wrapper>
  );
}
const mobxStore = new RootStore();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <storesContext.Provider value={mobxStore}>
        <SyncDataFromHook />
        <AppRoutes />
      </storesContext.Provider>
    </WagmiProvider>
  );
}

// Separate component to handle account sync inside WagmiProvider
const SyncDataFromHook = observer(() => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const { accountStore } = useStores();

  useEffect(() => {
    accountStore.setAddress(address);
    accountStore.setIsConnected(isConnected);
    accountStore.setChainId(chainId);
    accountStore.setWagmiConfig(config);
  }, [address, isConnected, chainId, accountStore, config]);

  return null;
});
