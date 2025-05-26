import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Radar, LucideProps } from "lucide-react";

export const PositionStateLoaderOnChainTask = {
  type: TaskType.POSITION_STATE_LOADER_ONCHAIN,
  label: "Load Position State (On‑Chain)",
  icon: (p: LucideProps) => <Radar className="stroke-lime-400" {...p} />,
  isEntryPoint: false,
  credits: 0.8,
  inputs: [
    { name: "Wallet Credential", type: TaskParamType.CREDENTIAL, required: true,
      description: "Private‑key credential that owns strategy funds" },
    { name: "RPC Endpoint", type: TaskParamType.STRING, required: false,
      description: "BSC RPC URL (HTTPS or WSS)" },
    { name: "Pair Contract", type: TaskParamType.STRING, required: true,
      description: "PancakeSwap Pair/Pool contract address to scan" },
      { name: "Pair Config", type: TaskParamType.STRING, required: true,
        description: "JSON { assetToken, quoteToken } from Pair Selector" },
    { name: "Block Look‑back", type: TaskParamType.STRING, required: false,
      description: "How many blocks backward to search (default 1k)" }
  ] as const,
  outputs: [
    { name: "Position State", type: TaskParamType.STRING,
      description: "JSON { address, lastSwap, balances }" }
  ] as const
} satisfies WorkflowTask;