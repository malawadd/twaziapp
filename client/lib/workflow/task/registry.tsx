
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";

import { TaskType } from "@/types/task";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI";
import { AgentKitSwapTask } from "./AgentKitSwapTask";
import { SmartContractInteractionTask } from "./SmartContractInteractionTask";
import { CreateRecallBucketTask } from "./CreateRecallBucketTask";
import { StoreAIOutputInBucketTask } from "./StoreAIOutputInBucketTask";
import { ReasoningLLMTask } from "./ReasoningLLMTask";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry:Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  AGENTKIT_SWAP:AgentKitSwapTask,
  SMART_CONTRACT_INTERACTION:SmartContractInteractionTask,
  CREATE_RECALL_BUCKET:CreateRecallBucketTask,
  STORE_AI_OUTPUT_RECALL:StoreAIOutputInBucketTask,
  REASONING_LLM:ReasoningLLMTask
};
