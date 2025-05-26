import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Octagon, LucideProps } from "lucide-react";

export const BoxStrategySelectorTask = {
  type: TaskType.BOX_STRATEGY_SELECTOR,
  label: "Box Strategy Selector",
  icon: (p: LucideProps) => <Octagon className="stroke-indigo-400" {...p} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    { name: "Feature Frame", type: TaskParamType.STRING, required: true },
    { name: "Volatility Threshold (range)", type: TaskParamType.STRING, required: false,
      description: "Max σ (e.g., 0.015) for Range Box" },
    { name: "Breakout Return Threshold", type: TaskParamType.STRING, required: false,
      description: "Min |return| (e.g., 0.005) to trigger Darvas" },
    { name: "Volume Surge Factor", type: TaskParamType.STRING, required: false,
      description: "Volume Δ / medianVol to confirm breakout (e.g., 0.5)" }
  ] as const,
  outputs: [
    { name: "Strategy Choice", type: TaskParamType.STRING,
      description: "JSON { strategy: 'darvas' | 'range' | 'hold', params }" }
  ] as const
} satisfies WorkflowTask;