"use client";
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react';
import React, { useState } from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import {
    ConnectWallet,
    ConnectWalletText,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi'
// 🚀 Route Configuration
const routes = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/workflows", label: "Workflows", icon: Layers2Icon },
    { href: "/credentials", label: "Credentials", icon: ShieldCheckIcon },
    { href: "/billings", label: "Billings", icon: CoinsIcon },
];

function DesktopSidebar() {
    const pathname = usePathname();
    const { address } = useAccount(); 
    // const activeRoute = routes.find((route) => pathname.includes(route.href)) || routes[0];
    const activeRoute = routes.find((route) => pathname === route.href) || routes[0];


    return (
        <div className="hidden md:flex flex-col min-w-[280px] max-w-[280px] h-screen bg-primary/5 dark:bg-secondary/30 border-r-4 border-black ">
            <div className="flex items-center justify-center p-4 border-b-4 border-black">
                <Logo />
            </div>

            {address ? (
                <>
                    <div className="p-2 font-bold text-center border-b-4 border-black">TODO CREDIT</div>
                    <div className="flex flex-col p-2 gap-4">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={buttonVariants({
                                    variant: activeRoute.href === route.href ? "noShadow" : "neutral",
                                }) + " flex items-center gap-2 p-3 border-4 border-black shadow-[4px_4px_0px_black] hover:shadow-none transition-all"}
                            >
                                <route.icon size={20} />
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <ConnectWallet className="p-4 border-4 border-black shadow-[4px_4px_0px_black] bg-red-500 " />
                </div>
            )}

            {address && (
                <div className="flex flex-col items-center mt-auto p-4 border-t-4 border-black shadow-[4px_4px_0px_black] relative">

                    <Wallet className="w-full flex flex-col items-center relative">
                        <ConnectWallet className="p-3 border-4 border-black shadow-[4px_4px_0px_black] bg-[#a3e636] hover:bg-[#a3e636] flex items-center gap-2   hover:shadow-none transition-all ">


                            <Name className='text-black' />
                        </ConnectWallet>
                        <WalletDropdown className="absolute bottom-full mb-2 w-4 bg-black text-white border-4 border-black shadow-[4px_4px_0px_black] rounded-md z-50"
                        >
                            <Identity
                                className="px-4 pt-3 pb-2 hover:bg-[#beee70]"
                                hasCopyAddressOnClick
                            >
                                <Avatar />
                                <Name />
                                <Address />
                                <EthBalance />
                            </Identity>

                            <WalletDropdownDisconnect className='hover:bg-[#beee70]' />
                        </WalletDropdown>
                    </Wallet>
                </div>
            )}
        </div>
    );
}

export function MobileSidebar() {
    const [isOpen, setOpen] = useState(false);
    const pathname = usePathname() ?? "";
    const { address } = useAccount();
    const activeRoute = routes.find((route) => pathname.includes(route.href)) || routes[0];

    return (
        <div className="block bg-background md:hidden ">
            <nav className="flex items-center justify-between p-4 border-b-1 border-black">

                <Sheet open={isOpen} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="border-4 border-black">
                            <MenuIcon className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        className="w-[300px] p-4 space-y-6 border-l-4 border-black bg-white"
                        side="left"
                    >
                        {address ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <Logo />

                                </div>
                                <div className="flex flex-col gap-4">
                                    {routes.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            onClick={() => setOpen(false)}
                                            className={buttonVariants({
                                                variant: activeRoute.href === route.href ? "noShadow" : "neutral",
                                            }) + " flex items-center gap-2 p-3 border-4 border-black shadow-[4px_4px_0px_black] hover:shadow-none transition-all"}
                                        >
                                            <route.icon size={20} />
                                            {route.label}
                                        </Link>
                                    ))}
                                </div>
                                <Wallet className=" flex items-center flex-auto flex-col">
                                    <ConnectWallet className="p-3 border-4 border-black shadow-[4px_4px_0px_black] bg-[#a3e636] hover:bg-[#a3e636] flex items-center gap-2   hover:shadow-none transition-all ">

                                        <Avatar className="h-6 w-6" />
                                        <Name className='text-black' />
                                    </ConnectWallet>
                                    <WalletDropdown className="relative">
                                        <Identity
                                            className="px-4 pt-3 pb-2 hover:bg-[#beee70]"
                                            hasCopyAddressOnClick
                                        >
                                            <Avatar />
                                            <Name />
                                            <Address />
                                            <EthBalance />
                                        </Identity>

                                        <WalletDropdownDisconnect className='hover:bg-[#beee70]' />
                                    </WalletDropdown>
                                </Wallet>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <ConnectWallet className="p-4 border-4 border-black shadow-[4px_4px_0px_black] bg-red-500 text-white" />
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
}

export default DesktopSidebar;
