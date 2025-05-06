import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { RefreshCcw, LucideProps } from "lucide-react";

export const ReflectionAgentTask = {
  type: TaskType.REFLECTION_AGENT,
  label: "Reflection Agent",
  icon: (props: LucideProps) => <RefreshCcw className="stroke-purple-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Recent Trading Decisions",
      type: TaskParamType.STRING,
      required: true,
      description: "History of recent trading actions and outcomes (JSON)"
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
      name: "Reflection Feedback",
      type: TaskParamType.STRING,
      description: "Feedback and suggestions for future trading decisions"
    },
  ] as const,
  
} satisfies WorkflowTask;
