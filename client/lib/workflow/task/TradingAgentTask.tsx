import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DollarSign, LucideProps } from "lucide-react";

export const TradingAgentTask = {
  type: TaskType.TRADING_AGENT,
  label: "Trading Agent",
  icon: (props: LucideProps) => <DollarSign className="stroke-green-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Market Analysis Report",
      type: TaskParamType.STRING,
      required: true,
      description: "Output from Market Analyst Agent"
    },
    {
      name: "News Analysis Report",
      type: TaskParamType.STRING,
      required: true,
      description: "Output from News Analyst Agent"
    },
    {
      name: "OpenAi Credentials",
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
      name: "Trading Decision",
      type: TaskParamType.STRING,
      description: "Buy, Sell, or Hold with rationale and allocation"
    },
  ] as const,
 
} satisfies WorkflowTask;
