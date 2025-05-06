import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Globe, LucideProps, BarChart3} from "lucide-react";

export const NewsAISearchTask = {
  type: TaskType.NEWS_AI_SEARCH,
  label: "News AI Search",
  icon: (props: LucideProps) => <BarChart3 className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Search Query",
      type: TaskParamType.STRING,
      required: true,
      description: "Prompt or query to search for news with AI"
    },
    {
      name: "Model",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "GPT-4o", value: "gpt-4o" },
        { label: "GPT-4.1", value: "gpt-4.1" },
        { label: "GPT-4.1-mini", value: "gpt-4.1-mini" },
        
      ],
      description: "Select the OpenAI model to use for search"
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      description: "OpenAI API credential"
    },
  ] as const,
  outputs: [
    {
      name: "News Search Result",
      type: TaskParamType.STRING,
      description: "AI-generated news summary with citations"
    },
  ] as const,
} satisfies WorkflowTask;
