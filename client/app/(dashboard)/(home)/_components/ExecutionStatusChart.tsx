"use client";

import { Card } from "@/components/ui/card";
import { WorkflowExecutionStats } from "@/types/analytics";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ExecutionStatusChart({
  data,
}: {
  data: WorkflowExecutionStats[];
}) {
  return (
    <Card className="p-6 flex flex-col gap-4 border-4 border-black shadow-[4px_4px_0px_black] dark:border-[#facc15] dark:text-black dark:shadow-[4px_4px_0px_#facc15]">
      <p className="font-bold">Execution Status Distribution</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="status"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
            Status
          </div>
          <div className="text-sm font-bold mb-2">
            {item.status}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1">
            Count
          </div>
          <div className="text-sm font-bold">
            {item.count}
          </div>
        </div>
      );
    }
    return null;
  }}
/>
            <Bar
              dataKey="count"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary/20 dark:fill-black/50"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
