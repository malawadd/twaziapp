import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Newspaper, LucideProps } from "lucide-react";

export const NewsApiTask = {
  type: TaskType.NEWS_API,
  label: "News API Search",
  icon: (props: LucideProps) => <Newspaper className="stroke-yellow-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Keyword",
      type: TaskParamType.STRING,
      required: true,
      description: "Keyword to search for in news articles"
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      description: "NewsAPI.org API credential"
    },
  ] as const,
  outputs: [
    {
      name: "Articles",
      type: TaskParamType.STRING,
      description: "JSON array of articles with title, description, content, and publishedAt"
    },
    {
      name: "Article URLs",
      type: TaskParamType.STRING,
      description: "JSON array of article URLs"
    },
  ] as const,
} satisfies WorkflowTask;
