import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ShieldCheck, LucideProps } from "lucide-react";

export const BoxRiskManagementTask = {
  type: TaskType.BOX_RISK_MANAGEMENT,
  label: "Box Risk Management (Spot)",
  icon: (p: LucideProps) => <ShieldCheck className="stroke-red-400" {...p} />,
  isEntryPoint: false,
  credits: 0.5,
  inputs: [
    { name: "Trade Plan", type: TaskParamType.STRING, required: true },
    { name: "Position State", type: TaskParamType.STRING, required: true },
    { name: "Feature Frame", type: TaskParamType.STRING, required: true },
    { name: "Pair Config", type: TaskParamType.STRING, required: true,
      description: "JSON { assetToken, quoteToken } from Pair Selector" },
    { name: "Max Position (%)", type: TaskParamType.STRING, required: false,
      description: "Max quote balance fraction to deploy (default 0.25)" },
    { name: "Max Risk (%)", type: TaskParamType.STRING, required: false,
      description: "Max equity risk per trade using stop‑loss (default 0.02)" },
    { name: "Max Open Trades", type: TaskParamType.STRING, required: false,
      description: "How many concurrent long positions allowed (default 1)" },
    { name: "Gas Limit (quote)", type: TaskParamType.STRING, required: false,
      description: "Max quote‑token cost you’re willing to pay in gas (default 5)" }
  ] as const,
  outputs: [
    { name: "Approved Trade Plan", type: TaskParamType.STRING,
      description: "Same JSON if approved, else action='HOLD'" }
  ] as const
} satisfies WorkflowTask;