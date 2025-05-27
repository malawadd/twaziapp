import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DollarSign, LucideProps } from "lucide-react";

export const QuoteSlippageTask = {
  type: TaskType.QUOTE_SLIPPAGE,
  label: "Quote & Slippage (PancakeSwap v2)",
  icon: (p: LucideProps) => <DollarSign className="stroke-sky-400" {...p} />,
  isEntryPoint: false,
  credits: 0.5,
  inputs: [
    { name: "Approved Trade Plan", type: TaskParamType.STRING, required: true },
    { name: "Pair Config", type: TaskParamType.STRING, required: true },
    { name: "RPC Endpoint", type: TaskParamType.STRING, required: false },
    { name: "Router Address", type: TaskParamType.STRING, required: false,
      description: "Defaults to PancakeSwap v2 BSC router" }
  ] as const,
  outputs: [
    { name: "Quote Data", type: TaskParamType.STRING,
      description: "JSON {expectedOut, minOut, slippageOk} or 'SKIP'" }
  ] as const
} satisfies WorkflowTask;