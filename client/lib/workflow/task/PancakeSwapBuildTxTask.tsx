import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileSignature, LucideProps } from "lucide-react";

export const PancakeSwapBuildTxTask  = {
  type: TaskType.BUILD_TX,
  label: "PancakeSwap BuildTx (v2)",
  icon: (p: LucideProps) => <FileSignature className="stroke-fuchsia-400" {...p} />,
  isEntryPoint: false,
  credits: 0.5,
  inputs: [
    { name: "Approved Trade Plan", type: TaskParamType.STRING, required: true },
    { name: "Quote Data", type: TaskParamType.STRING, required: true },
    { name: "Pair Config", type: TaskParamType.STRING, required: true },
    { name: "Wallet Credential", type: TaskParamType.CREDENTIAL, required: true },
    { name: "Router Address", type: TaskParamType.STRING, required: false },
    { name: "Deadline (min)", type: TaskParamType.STRING, required: false,
      description: "Tx expiry in minutes (default 5)" }
  ] as const,
  outputs: [
    { name: "Tx Data", type: TaskParamType.STRING,
      description: "JSON { to, data, value, chainId } or 'SKIP'" }
  ] as const
} satisfies WorkflowTask;