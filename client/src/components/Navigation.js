import React from "react";
import { Link } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import "./navigation.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
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

const Navigation = () => {
  return (
    <div className="navbar">
      <img src="nft.jpg" alt="marketplace"></img>
      <div className="navbar_links">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/my-listed-items">My Listed Items</Link>
        <Link to="/mypurchases">My Purchases</Link>
      </div>

      <div>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider theme={darkTheme()} chains={chains}>
            <ConnectButton />
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </div>
  );
};

export default Navigation;
