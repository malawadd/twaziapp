"use client";

import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "../../app/globals.css";

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}

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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >

          {children}

        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </OnchainKitProvider>
  );
}
