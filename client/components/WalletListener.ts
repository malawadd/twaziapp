"use client";
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export default function WalletListener() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Save the address to the session (cookie) when connected
    if (isConnected && address) {
      fetch('/api/save-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
    }

    // Clear the session when disconnected
    if (!isConnected) {
      fetch('/api/save-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: '' }),
      });
    }
  }, [address, isConnected]);

  return null; // No UI rendered
}
