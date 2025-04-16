"use client";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function WalletListener() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
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
        }).then(() => {
          router.refresh();
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
      }).then(() => {
        router.refresh();
      });
    }

    // If the wallet has just disconnected, clear the address
    if (prevIsConnected.current && !isConnected) {
      fetch("/api/save-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: "" }),
      }).then(() => {
        router.refresh();
      });
    }

    // Update the previous state for next comparison
    prevIsConnected.current = isConnected;
  }, [address, isConnected, router]);

  return null; // No UI rendered
}
