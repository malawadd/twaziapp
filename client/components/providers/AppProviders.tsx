"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing
 

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
         <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia} // add baseSepolia for testing
      config={{
        appearance: {
          name: 'tawazi',        // Displayed in modal header
          logo: 'https://your-logo.com',// Displayed in modal header
          mode: 'auto',                 // 'light' | 'dark' | 'auto'
          theme: 'default',             // 'default' or custom theme
        },
        wallet: { 
          display: 'modal'
        },
      }}
    >
      {children}
      </OnchainKitProvider>
    </ThemeProvider>
  );
}
