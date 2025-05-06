import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileText, LucideProps } from "lucide-react";

export const OrderFormattingTask = {
  type: TaskType.ORDER_FORMATTING,
  label: "Order Formatting",
  icon: (props: LucideProps) => <FileText className="stroke-cyan-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Risk-Checked Decision",
      type: TaskParamType.STRING,
      required: true,
      description: "Trading decision after risk management"
    },
    {
      name: "Exchange Info",
      type: TaskParamType.STRING,
      required: true,
      description: "Exchange or smart contract details (JSON)"
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Balances",
      type: TaskParamType.STRING,
      required: true,
      description: "JSON object with asset balances from Balance Fetch task"
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: false,
      variant: "textarea",
      description: "Optional custom prompt for the agent"
    },
  ] as const,
  outputs: [
    {
      name: "Formatted Order",
      type: TaskParamType.STRING,
      description: "Order formatted for execution on the target platform"
    },
  ] as const,
} satisfies WorkflowTask;
