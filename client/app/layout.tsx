import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import '@coinbase/onchainkit/styles.css'; 
import WalletListener from "@/components/WalletListener";
import { WalletProvider } from "../contexts/WalletContext";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twazi",
  description: "agents workflows",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
        <WalletProvider>
        <WalletListener />
        {children}
        </WalletProvider>
        </AppProviders>
        <Toaster richColors/>
       </body>
       
    </html>
  );
}
