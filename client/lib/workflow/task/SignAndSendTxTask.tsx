import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Send, LucideProps } from "lucide-react";

export const SignAndSendTxTask = {
  type: TaskType.SIGN_AND_SEND_TX,
  label: "Sign & Send Tx (BSC)",
  icon: (p: LucideProps) => <Send className="stroke-purple-400" {...p} />,
  isEntryPoint: false,
  credits: 0.5,
  inputs: [
    { name: "Tx Data", type: TaskParamType.STRING, required: true },
    { name: "Wallet Credential", type: TaskParamType.CREDENTIAL, required: true },
    { name: "Pair Config", type: TaskParamType.STRING, required: true },
    { name: "Approved Trade Plan", type: TaskParamType.STRING, required: true },
    { name: "Quote Data", type: TaskParamType.STRING, required: true },
    { name: "RPC Endpoint", type: TaskParamType.STRING, required: false },
    { name: "Gas Price (gwei)", type: TaskParamType.STRING, required: false }
  ] as const,
  outputs: [
    { name: "Tx Hash", type: TaskParamType.STRING,
      description: "Hex hash if broadcasted, else 'SKIP'" }
  ] as const
} satisfies WorkflowTask;