import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { SlidersHorizontal, LucideProps } from "lucide-react";

export const MarketDataPreProcessorTask = {
  type: TaskType.MARKET_PREPROCESSOR as const,
  label: "Market Data Pre‑Processor (CoinGecko)",
  icon: (p: LucideProps) => <SlidersHorizontal className="stroke-sky-400" {...p} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    { name: "CoinGecko JSON", type: TaskParamType.STRING, required: true,
      description: "Raw JSON string from /coins/{id}/market_chart" },
    { name: "Return Period", type: TaskParamType.STRING, required: false,
      description: "N‑period returns to compute (default 1 step)" }
  ],
  outputs: [
    { name: "Feature Frame", type: TaskParamType.STRING,
      description: "JSON with derived indicators" }
  ]
};
