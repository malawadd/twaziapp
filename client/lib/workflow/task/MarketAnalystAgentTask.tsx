import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BarChart3, LucideProps } from "lucide-react";

export const MarketAnalystAgentTask = {
  type: TaskType.MARKET_ANALYST_AGENT,
  label: "Market Analyst Agent",
  icon: (props: LucideProps) => <BarChart3 className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Market Data",
      type: TaskParamType.STRING,
      required: true,
      description: "On-chain market data, technical indicators, and statistics (JSON)"
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
      name: "Market Analysis Report",
      type: TaskParamType.STRING,
      description: "Summary of market trends and signals"
    },
  ] as const,
  
} satisfies WorkflowTask;
