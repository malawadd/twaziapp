// contexts/WalletContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState(null);

  // Optionally, on mount, load a previously stored wallet from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  // Update local state (and persistent storage) when connection status changes
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
    } else {
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
    }
  }, [address, isConnected]);

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
