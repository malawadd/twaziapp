import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BotIcon } from "lucide-react";

export const ReasoningLLMTask = {
  type: TaskType.REASONING_LLM,
  label: "Get Reasoning from LLM",
  icon: (props) => <BotIcon className="stroke-purple-500" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Messages",
      type: TaskParamType.STRING, // JSON.stringify([{ role: "user", content: "..." }])
      variant: "textarea",
      required: true,
    },
    {
      name: "API Key",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
        name: "Bucket",
        type: TaskParamType.STRING,
        required: false,
      },
  ] as const,
  outputs: [
    {
      name: "Reasoning Output",
      type: TaskParamType.STRING,
    },
    {
        name: "Final Answer",
        type: TaskParamType.STRING,
      },
  ] as const,
} satisfies WorkflowTask;
