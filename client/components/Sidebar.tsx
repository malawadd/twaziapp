"use client";
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react';
import React, { useState } from 'react'
import Logo from './Logo';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';
import {Sheet,  SheetTrigger, SheetContent } from './ui/sheet';

const routes = [
    {
      href: "",
      label: "Home",
      icon: HomeIcon,
    },
    {
      href: "workflows",
      label: "Workflows",
      icon: Layers2Icon,
    },
    {
      href: "credentials",
      label: "Credentials",
      icon: ShieldCheckIcon,
    },
    {
      href: "billings",
      label: "Billings",
      icon: CoinsIcon,
    },
  ];

function DesktopSidebar() {

   

      const pathname = usePathname();
const activeRoute = 
  routes.find(
    (route) => route.href.length > 0 && pathname.includes(route.href)
  ) || routes[0];


      
      return (
        <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full
          bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
          <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
            <Logo />
          </div>
          <div className='p-2'> TODO CREDIT </div>
          <div className='flex flex-col p-2'>
            {routes.map(route=>(
                <Link key={route.href} href={route.href} className={buttonVariants({
                    variant: activeRoute.href === route.href ? "noShadow" : "neutral",
                    
                })}>
                    <route.icon size={20}/>
                    {route.label}
                    
                </Link>
            ))}
          </div>
        </div>
      );
      
}

export function MobileSidebar() {
    const [isOpen, setOpen] = useState(false);
    const pathname = usePathname();
    const activeRoute = routes.find((route) =>
      route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  
    return (
      <div className="block bg-background md:hidden ">
        <nav className="flex items-center justify-between p-4 border-b-1 border-black">
          
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="border-4 border-black ">
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[300px] sm:w-[360px] p-4 space-y-6 border-l-4 border-black bg-white "
              side="left"
            >
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
                    }) + " flex items-center gap-3 p-3 border-4 border-black shadow-[4px_4px_0px_black] hover:shadow-none transition-all"}
                  >
                    <route.icon size={20} />
                    {route.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    );
  }


export default DesktopSidebar