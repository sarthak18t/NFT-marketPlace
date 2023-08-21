import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, sepolia, hardhat } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, sepolia, hardhat],
  [
    alchemyProvider({ apiKey: "KzYpiq_aEQlepAXTUQzb7JvAsdKwXSZH" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "NFT-marketplace",
  projectId: "79db8fce81bf1eaa2daeadbf0b5fbb23",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiConfig config={wagmiConfig}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </WagmiConfig>
);

reportWebVitals();
