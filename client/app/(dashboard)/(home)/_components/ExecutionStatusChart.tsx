"use client";

import { Card } from "@/components/ui/card";
import { WorkflowExecutionStats } from "@/types/analytics";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
            <Tooltip />
            <Bar
              dataKey="count"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary dark:fill-black/50"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}