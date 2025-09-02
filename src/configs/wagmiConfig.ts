import { createAppKit } from "@reown/appkit/react";

import {
  sepolia,
  mainnet,
  polygon,
  bsc,
  arbitrum,
  base,
} from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 1. Get projectId from https://dashboard.reown.com
const projectId = "36bebdc48976ed77532a5c54a88ef585";

// 2. Create a metadata object - optional
const metadata = {
  name: "ZExpire",
  description: "ZExpire Presale Platform",
  url: "https://zexpire.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
const networks = [sepolia, mainnet, polygon, bsc, arbitrum, base] as any;

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // Отключаем email аутентификацию
    socials: [], // Отключаем социальные сети (пустой массив)
    emailShowWallets: false, // Не показываем кошельки в email секции
  },
  allWallets: "SHOW", // Показываем все кошельки
});

export default wagmiAdapter.wagmiConfig;
