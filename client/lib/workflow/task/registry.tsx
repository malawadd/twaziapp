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
import { MarketAnalystAgentTask } from "./MarketAnalystAgentTask";
import { NewsAnalystAgentTask } from "./NewsAnalystAgentTask";
import { TradingAgentTask } from "./TradingAgentTask";
import { ReflectionAgentTask } from "./ReflectionAgentTask";
import { RiskManagementTask } from "./RiskManagementTask";
import { OrderFormattingTask } from "./OrderFormattingTask";
import { BalanceFetchTask } from "./BalanceFetchTask";
import { NewsAISearchTask } from "./NewsAISearchTask";
import { NewsApiTask } from "./NewsApiTask";
import { CoinGeckoMarketChartTask } from "./CoinGeckoMarketChartTask";
import { MergeInputsTask } from "./MergeInputsTask";
import { PositionStateLoaderOnChainTask } from "./PositionStateLoaderOnChainTask";
import { PairSelectorTask } from "./PairSelectorTask";
import { MarketDataPreProcessorTask } from "./MarketDataPreProcessorTask";
import { BoxStrategySelectorTask } from "./BoxStrategySelectorTask";
import { SignalGeneratorTask } from "./SignalGeneratorTask";
import { BoxRiskManagementTask } from "./BoxRiskManagementTask";
import { ConditionRouterTask } from "./ConditionRouterTask";
import { QuoteSlippageTask } from "./QuoteSlippageTask";
import { PancakeSwapBuildTxTask } from "./PancakeSwapBuildTxTask";
import { SignAndSendTxTask } from "./SignAndSendTxTask";
import { AddPropertyToJsonTask } from "./AddPropertyToJson";
import { ClickElementTask } from "./ClickElement";
import { DeliverViaWebhookTask } from "./DeliverViaWebhook";
import { FillInputTask } from "./FillInput";
import { NavigateUrlTask } from "./NavigateUrlTask";
import { ReadPropertyFromJsonTask } from "./ReadPropertyFromJson";
import { ScrollToElementTask } from "./ScrollToElement";
import { WaitForElementTask } from "./WaitForElement";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  AGENTKIT_SWAP: AgentKitSwapTask,
  SMART_CONTRACT_INTERACTION: SmartContractInteractionTask,
  CREATE_RECALL_BUCKET: CreateRecallBucketTask,
  STORE_AI_OUTPUT_RECALL: StoreAIOutputInBucketTask,
  REASONING_LLM: ReasoningLLMTask,
  MARKET_ANALYST_AGENT: MarketAnalystAgentTask,
  NEWS_ANALYST_AGENT: NewsAnalystAgentTask,
  TRADING_AGENT: TradingAgentTask,
  REFLECTION_AGENT: ReflectionAgentTask,
  RISK_MANAGEMENT: RiskManagementTask,
  ORDER_FORMATTING: OrderFormattingTask,
  BALANCE_FETCH: BalanceFetchTask,
  NEWS_AI_SEARCH:NewsAISearchTask,
  NEWS_API:NewsApiTask,
  COINGECKO_MARKET_CHART:CoinGeckoMarketChartTask,
  MERGE_INPUTS: MergeInputsTask,
  POSITION_STATE_LOADER_ONCHAIN: PositionStateLoaderOnChainTask,
  PAIR_SELECTOR: PairSelectorTask,
  MARKET_PREPROCESSOR: MarketDataPreProcessorTask,
  BOX_STRATEGY_SELECTOR:BoxStrategySelectorTask,
  SIGNAL_GENERATOR:SignalGeneratorTask,
  BOX_RISK_MANAGEMENT: BoxRiskManagementTask, 
  CONDITION_ROUTER: ConditionRouterTask,
  QUOTE_SLIPPAGE: QuoteSlippageTask,
  BUILD_TX:PancakeSwapBuildTxTask,
  SIGN_AND_SEND_TX:SignAndSendTxTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_EMELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};
