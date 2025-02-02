"use client";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f0f0] text-center p-8 border-4 border-black shadow-[8px_8px_0px_black]"> 
      <h1 className="text-8xl font-extrabold text-black border-4 border-black px-6 py-4 shadow-[4px_4px_0px_black] bg-[#ff6347]">404</h1> 
      
      <h2 className="text-3xl font-bold text-black mt-6 border-4 border-black px-4 py-2 bg-[#ffff00] shadow-[4px_4px_0px_black]">Page Not Found</h2>
      
      <p
  className="text-black mt-4 max-w-md mx-auto border-4 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] transform rotate-[+5deg] skew-y-2"
>
  Oops! This page fell off the grid. Blame the internet.
</p>


      <div className="flex justify-center gap-4 mt-8">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-[#a3e636] text-black border-4 border-black shadow-[4px_4px_0px_black] hover:shadow-none transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 stroke-black" />
          <span className="font-bold">Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
