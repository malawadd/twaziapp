
import { ExtractTextFromElementExecutor } from "@/lib/workflow/executor/ExtractTextFromElementExecutor";
import { LaunchBrowserExecutor } from "@/lib/workflow/executor/LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "@/lib/workflow/executor/PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ExtractDataWithAiExecutor } from "./ExtractDataWithAiExecutor";
import { AgentKitSwapExecutor } from "./AgentKitSwapExecutor";
import { SmartContractInteractionExecutor } from "./SmartContractInteractionExecutor";
import { CreateRecallBucketExecutor } from "./CreateRecallBucketExecutor";
import { StoreAIOutputInBucketExecutor } from "./StoreAIOutputInBucketExecutor";
import { ReasoningLLMExecutor } from "./ReasoningLLMExecutor";


type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
  AGENTKIT_SWAP : AgentKitSwapExecutor,
  SMART_CONTRACT_INTERACTION: SmartContractInteractionExecutor,
  CREATE_RECALL_BUCKET:CreateRecallBucketExecutor,
  STORE_AI_OUTPUT_RECALL: StoreAIOutputInBucketExecutor,
  REASONING_LLM: ReasoningLLMExecutor
  
};
