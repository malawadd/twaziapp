import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Wallet, LucideProps } from "lucide-react";

export const BalanceFetchTask = {
  type: TaskType.BALANCE_FETCH,
  label: "Balance Fetch",
  icon: (props: LucideProps) => <Wallet className="stroke-indigo-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Wallet Address",
      type: TaskParamType.STRING,
      required: true,
      description: "Wallet address to fetch balances for"
    },
    {
      name: "Assets",
      type: TaskParamType.STRING,
      required: true,
      description: "Comma-separated list of asset symbols or contract addresses"
    },
    {
      name: "Network",
      type: TaskParamType.STRING,
      required: true,
      description: "Network name or chain ID (e.g., ethereum, polygon, 1, 137)"
    },
  ] as const,
  outputs: [
    {
      name: "Balances",
      type: TaskParamType.STRING,
      description: "JSON object with asset balances"
    },
  ] as const,
} satisfies WorkflowTask;
