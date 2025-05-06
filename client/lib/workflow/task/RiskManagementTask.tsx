import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ShieldCheck, LucideProps } from "lucide-react";

export const RiskManagementTask = {
  type: TaskType.RISK_MANAGEMENT,
  label: "Risk Management",
  icon: (props: LucideProps) => <ShieldCheck className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Trading Decision",
      type: TaskParamType.STRING,
      required: true,
      description: "Buy/Sell/Hold decision with rationale and allocation"
    },
    {
      name: "Risk Parameters",
      type: TaskParamType.STRING,
      required: true,
      description: "Risk management parameters (e.g., max allocation, stop-loss, exposure limits)"
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
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
      name: "Risk-Checked Decision",
      type: TaskParamType.STRING,
      description: "Trading decision after risk checks and adjustments"
    },
  ] as const,
} satisfies WorkflowTask;
