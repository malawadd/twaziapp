import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, LineChart } from "lucide-react";

export const CoinGeckoMarketChartTask = {
  type: TaskType.COINGECKO_MARKET_CHART,
  label: "CoinGecko Token Market Chart",
  icon: (props: LucideProps) => <LineChart className="stroke-green-500" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Coin ID",
      type: TaskParamType.STRING,
      required: true,
      description: "CoinGecko coin id (e.g. 'binancecoin', 'ethereum')"
    },
    {
      name: "Days",
      type: TaskParamType.STRING,
      required: false,
      description: "Number of days to fetch (default: 1)"
    },
    {
      name: "API Key",
      type: TaskParamType.CREDENTIAL,
      required: true,
      description: "CoinGecko API key (required)"
    },
  ] as const,
  outputs: [
    {
        name: "Full JSON",
        type: TaskParamType.STRING,
        description: "Array of [timestamp, price] pairs"
      },
    {
      name: "Prices",
      type: TaskParamType.STRING,
      description: "Array of [timestamp, price] pairs"
    },
    {
      name: "Market Caps",
      type: TaskParamType.STRING,
      description: "Array of [timestamp, market cap] pairs"
    },
    {
      name: "Total Volumes",
      type: TaskParamType.STRING,
      description: "Array of [timestamp, total volume] pairs"
    },
  ] as const,
} satisfies WorkflowTask;
