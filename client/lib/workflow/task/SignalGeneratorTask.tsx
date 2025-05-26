import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { TrendingUp, LucideProps } from "lucide-react";

export const SignalGeneratorTask = {
  type: TaskType.SIGNAL_GENERATOR,
  label: "Signal Generator (Spot DEX)",
  icon: (p: LucideProps) => <TrendingUp className="stroke-teal-400" {...p} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    { name: "Strategy Choice", type: TaskParamType.STRING, required: true },
    { name: "Feature Frame", type: TaskParamType.STRING, required: true },
    { name: "Position State", type: TaskParamType.STRING, required: true },
    { name: "Pair Config", type: TaskParamType.STRING, required: true,
        description: "JSON { assetToken, quoteToken } from Pair Selector" },
    { name: "Trade Size (% of quote)", type: TaskParamType.STRING, required: false,
      description: "0–1 fraction of quote balance per entry (default 0.1)" },
    { name: "Slippage (bps)", type: TaskParamType.STRING, required: false,
      description: "Max slippage for BuildTx (e.g., 30 = 0.3 %)" }
  ] as const,
  outputs: [
    { name: "Trade Plan", type: TaskParamType.STRING,
      description: "JSON {action, size, priceLimit, stopLoss, meta}" }
  ] as const
} satisfies WorkflowTask;