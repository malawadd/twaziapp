"use client";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckUserExists } from "@/actions/auth/checkUserExists";

export default function WalletListener() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const prevIsConnected = useRef<boolean | null>(null);

  useEffect(() => {
    // Helper function to check user and redirect if needed
    const checkUserAndRedirect = async (addr: string) => {
      const exists = await CheckUserExists();
      if (!exists) {
        router.push("/setup");
      }
      router.refresh();
    };

    // On first render or when wallet connects
    if (
      (prevIsConnected.current === null || !prevIsConnected.current) &&
      isConnected &&
      address
    ) {
      fetch("/api/save-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      }).then(async () => {
        await checkUserAndRedirect(address);
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
