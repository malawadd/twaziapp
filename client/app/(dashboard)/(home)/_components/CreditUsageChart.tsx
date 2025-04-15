"use client";

import { Card } from "@/components/ui/card";
import { CreditUsage } from "@/types/analytics";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CreditUsageChart({ data }: { data: CreditUsage[] }) {
  return (
    <Card className="p-6 flex flex-col gap-4 border-4 border-black shadow-[4px_4px_0px_black] dark:border-[#facc15] dark:text-black dark:shadow-[4px_4px_0px_#facc15]">
      <p className="font-bold">Credit Usage Over Time</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
           <Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-md border border-black bg-white dark:bg-black text-black dark:text-white p-3 shadow-md min-w-[160px]">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1">
            Date
          </div>
          <div className="text-sm font-bold mb-2">
            {new Date(item.date).toLocaleDateString()}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1">
            Credits
          </div>
          <div className="text-sm font-bold">
            {item.credits}
          </div>
        </div>
      );
    }
    return null;
  }}
/>
            <Area
              dataKey="credits"
              fill="currentColor"
              stroke="currentColor"
              className="fill-primary stroke-primary dark:fill-[#facc15]/20 dark:stroke-[#facc15]"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}