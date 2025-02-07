"use client";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";

export default function WalletListener() {
  const { address, isConnected } = useAccount();
  // Explicitly type the ref to accept boolean or null.
  const prevIsConnected = useRef<boolean | null>(null);

  useEffect(() => {
    // On first render, prevIsConnected.current is null.
    if (prevIsConnected.current === null) {
      prevIsConnected.current = isConnected;
      if (isConnected && address) {
        fetch("/api/save-address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
      }
      return;
    }

    // If the wallet has just connected, save the address
    if (!prevIsConnected.current && isConnected && address) {
      fetch("/api/save-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
    }

    // If the wallet has just disconnected, clear the address
    if (prevIsConnected.current && !isConnected) {
      fetch("/api/save-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: "" }),
      });
    }

    // Update the previous state for next comparison
    prevIsConnected.current = isConnected;
  }, [address, isConnected]);

  return null; // No UI rendered
}
