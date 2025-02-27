// /lib/workflow/task/AgentKitSwapTask.ts
import { WorkflowTask } from "@/types/workflow";
import { TaskParamType, TaskType } from "@/types/task";
import { LucideProps, ShoppingCartIcon } from "lucide-react";

export const AgentKitSwapTask = {
  type: TaskType.AGENTKIT_SWAP,
  label: "Execute Swap with AgentKit",
  icon: (props: LucideProps) => (
    <ShoppingCartIcon className="stroke-green-600" {...props} />
  ),
  isEntryPoint: true,
  credits: 10,
  inputs: [
    {
      name: "CDP API Key Name",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "CDP API Key Private Key",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "From Token",
      type: TaskParamType.STRING,
      required: true,
      description: "Token address (or symbol) to swap from",
    },
    {
      name: "To Token",
      type: TaskParamType.STRING,
      required: true,
      description: "Token address (or symbol) to swap to",
    },
    {
      name: "Amount",
      type: TaskParamType.STRING,
      required: true,
      description: "Amount to swap (decimal or ether units)",
    },
    {
      name: "Wallet Name",
      type: TaskParamType.STRING,
      required: false,
      description: "An optional name for your AgentKit wallet record",
    },
  ] as const,
  outputs: [
    {
      name: "Swap Transaction Receipt",
      type: TaskParamType.STRING,
      description: "The transaction hash or receipt from the swap",
    },
  ] as const,
} satisfies WorkflowTask;
