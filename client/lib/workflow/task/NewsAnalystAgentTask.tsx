import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Newspaper, LucideProps } from "lucide-react";

export const NewsAnalystAgentTask = {
  type: TaskType.NEWS_ANALYST_AGENT,
  label: "News Analyst Agent",
  icon: (props: LucideProps) => <Newspaper className="stroke-yellow-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "News Data",
      type: TaskParamType.STRING,
      required: true,
      description: "Off-chain news, social media, and sentiment data (JSON)"
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
      name: "News Analysis Report",
      type: TaskParamType.STRING,
      description: "Summary of news and sentiment impact"
    },
  ] as const,
  
} satisfies WorkflowTask;
