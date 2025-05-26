import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Sliders, LucideProps } from "lucide-react";

export const PairSelectorTask = {
  type: TaskType.PAIR_SELECTOR as const,
  label: "Pair Selector (BSC)",
  icon: (p: LucideProps) => <Sliders className="stroke-cyan-400" {...p} />,
  isEntryPoint: false,
  credits: 0.1,
  inputs: [
    { name: "Asset Token (buy)", type: TaskParamType.STRING, required: true,
      description: "Symbol or address of the token you BUY (e.g. BNB)" },
    { name: "Quote Token (spend)", type: TaskParamType.STRING, required: true,
      description: "Symbol or address of the token you SPEND (e.g. USDT)" }
  ],
  outputs: [
    { name: "Pair Config", type: TaskParamType.STRING,
      description: "JSON { assetToken, quoteToken }" }
  ]
}satisfies WorkflowTask;
