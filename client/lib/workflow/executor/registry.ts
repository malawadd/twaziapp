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
import { MarketAnalystAgentExecutor } from "./MarketAnalystAgentExecutor";
import { NewsAnalystAgentExecutor } from "./NewsAnalystAgentExecutor";
import { TradingAgentExecutor } from "./TradingAgentExecutor";
import { ReflectionAgentExecutor } from "./ReflectionAgentExecutor";
import { RiskManagementExecutor } from "./RiskManagementExecutor";
import { OrderFormattingExecutor } from "./OrderFormattingExecutor";
import { BalanceFetchExecutor } from "./BalanceFetchExecutor";
import { NewsAISearchExecutor } from "./NewsAISearchExecutor";
import { NewsApiExecutor } from "./NewsApiExecutor";

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
  AGENTKIT_SWAP: AgentKitSwapExecutor,
  SMART_CONTRACT_INTERACTION: SmartContractInteractionExecutor,
  CREATE_RECALL_BUCKET: CreateRecallBucketExecutor,
  STORE_AI_OUTPUT_RECALL: StoreAIOutputInBucketExecutor,
  REASONING_LLM: ReasoningLLMExecutor,
  MARKET_ANALYST_AGENT: MarketAnalystAgentExecutor,
  NEWS_ANALYST_AGENT: NewsAnalystAgentExecutor,
  TRADING_AGENT: TradingAgentExecutor,
  REFLECTION_AGENT: ReflectionAgentExecutor,
  RISK_MANAGEMENT: RiskManagementExecutor,
  ORDER_FORMATTING: OrderFormattingExecutor,
  BALANCE_FETCH: BalanceFetchExecutor,
  NEWS_AI_SEARCH:NewsAISearchExecutor,
  NEWS_API: NewsApiExecutor,
}