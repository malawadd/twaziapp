"use client";
import { cn } from '@/lib/utils';
import { SquareDashedMousePointer } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react'; 

function Logo({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link href="/" className="flex items-center gap-3 p-2 border-4 border-black bg-[#a3e636] "> 
      <div className="p-2 bg-white border-4 border-black shadow-[4px_4px_0px_black]"> 
        <SquareDashedMousePointer size={iconSize} className="stroke-black" />
      </div>
      <span className={cn("font-extrabold text-black", fontSize)}>Twazi </span>
    </Link>
  );
}

export default Logo;
