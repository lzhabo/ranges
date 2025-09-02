import { createAppKit } from "@reown/appkit/react";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  sepolia
} from "@reown/appkit/networks";

// 1. Get projectId from https://dashboard.reown.com
const projectId = "546a21374c699f782f21670a1405a02a";

// 2. Create a metadata object - optional
const metadata = {
  name: "Ranges Finance",
  description: "Ranges finance",
  url: "https://ranges.finance", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
const networks = [sepolia] as any;

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
