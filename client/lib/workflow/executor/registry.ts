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
import { CoinGeckoMarketChartExecutor } from "./CoinGeckoMarketChartExecutor";
import { MergeInputsExecutor } from "./MergeInputsExecutor";
import { PositionStateLoaderOnChainExecutor } from "./PositionStateLoaderOnChainExecutor";
import { PairSelectorExecutor } from "./PairSelectorExecutor";
import { MarketDataPreProcessorExecutor } from "./MarketDataPreProcessorExecutor";
import { BoxStrategySelectorExecutor } from "./BoxStrategySelectorExecutor";
import { SignalGeneratorExecutor } from "./SignalGeneratorExecutor";
import { BoxRiskManagementExecutor } from "./BoxRiskManagementExecutor";
import { ConditionRouterExecutor } from "./ConditionRouterExecutor";
import { QuoteSlippageExecutor } from "./QuoteSlippageExecutor";
import { PancakeSwapBuildTxExecutor } from "./PancakeSwapBuildTxExecutor";
import { SignAndSendTxExecutor } from "./SignAndSendTxExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropertyToJsonExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";
import { NavigateUrlExecutor } from "./NavigateUrlExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { ScrollToElementExecutor } from "./ScrollToElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";



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
  NEWS_AI_SEARCH: NewsAISearchExecutor,
  NEWS_API: NewsApiExecutor,
  COINGECKO_MARKET_CHART: CoinGeckoMarketChartExecutor,
  MERGE_INPUTS: MergeInputsExecutor,
  POSITION_STATE_LOADER_ONCHAIN: PositionStateLoaderOnChainExecutor,
  PAIR_SELECTOR: PairSelectorExecutor,
  MARKET_PREPROCESSOR: MarketDataPreProcessorExecutor,
  BOX_STRATEGY_SELECTOR: BoxStrategySelectorExecutor,
  SIGNAL_GENERATOR:SignalGeneratorExecutor,
  BOX_RISK_MANAGEMENT: BoxRiskManagementExecutor,
  CONDITION_ROUTER: ConditionRouterExecutor,
  QUOTE_SLIPPAGE: QuoteSlippageExecutor,
  BUILD_TX: PancakeSwapBuildTxExecutor,
  SIGN_AND_SEND_TX: SignAndSendTxExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_EMELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,

};
