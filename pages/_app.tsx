import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  rainbowWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import Navbar from "../components/NavBar";
import Header from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import { Toaster } from "../components/ui/toaster";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId={clientId}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        localWallet(),
        embeddedWallet(),
        rainbowWallet(),
      ]}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <Toaster />
        <Component {...pageProps} />
        <Navbar />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
