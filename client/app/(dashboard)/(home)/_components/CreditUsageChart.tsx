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
                  return (
                    <div className="rounded-lg border border-black dark:border-[#facc15] bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-sm">
                            {new Date(
                              payload[0].payload.date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Credits
                          </span>
                          <span className="font-bold text-sm">
                            {payload[0].value}
                          </span>
                        </div>
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
              className="fill-primary/20 stroke-primary dark:fill-[#facc15]/20 dark:stroke-[#facc15]"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}