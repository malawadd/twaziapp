"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationTabs({ workflowId }: { workflowId: string }) {
  const pathname = usePathname();
  const activeValue = pathname?.split("/")[2];

  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 border-4 border-black bg-white dark:bg-black shadow-[4px_4px_0px_black] rounded-none">
        <Link href={`/workflow/editor/${workflowId}`} className="w-full">
          <TabsTrigger
            value="editor"
            className="w-full rounded-none border-r-2 border-black font-bold text-black dark:text-white transition-all hover:bg-yellow-500 hover:translate-x-1 hover:translate-y-1 hover:shadow-none data-[state=active]:bg-[#7fbf25] data-[state=active]:shadow-none"
          >
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`} className="w-full">
          <TabsTrigger
            value="runs"
            className="w-full rounded-none font-bold text-black dark:text-white transition-all hover:bg-yellow-500 hover:translate-x-1 hover:translate-y-1 hover:shadow-none data-[state=active]:bg-[#7fbf25] data-[state=active]:shadow-none"
          >
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
