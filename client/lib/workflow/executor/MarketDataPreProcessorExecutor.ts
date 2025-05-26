import { ExecutionEnvironment } from "@/types/executor";
import { MarketDataPreProcessorTask } from "@/lib/workflow/task/MarketDataPreProcessorTask";

const pctChange = (curr: number, prev: number) => (prev === 0 ? 0 : (curr - prev) / prev);
const stddev = (arr: number[]) => {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
};

export async function MarketDataPreProcessorExecutor(env: ExecutionEnvironment<typeof MarketDataPreProcessorTask>): Promise<boolean> {
  try {
    const raw = env.getInput("CoinGecko JSON");
    const period = env.getInput("Return Period") || 1;
    const parsed = JSON.parse(raw);

    const prices: [number, number][] = parsed.prices || [];
    const marketCaps: [number, number][] = parsed.market_caps || [];
    const vols: [number, number][] = parsed.total_volumes || [];

    if (prices.length === 0) throw new Error("No price data in input JSON");

    const ts = prices.map(p => p[0]);
    const priceVals = prices.map(p => p[1]);
    const mcapVals = marketCaps.map(m => m[1]);
    const volVals = vols.map(v => v[1]);

    const periodNum = typeof period === "string" ? parseInt(period, 10) : period;
    const returns: number[] = priceVals.map((_, i) => {
      if (i < periodNum) return 0;
      return pctChange(priceVals[i], priceVals[i - periodNum]);
    });

    const volDelta: number[] = volVals.map((v, i) => (i === 0 ? 0 : v - volVals[i - 1]));

    const lastIdx = priceVals.length - 1;
    const frame = {
      timestamps: ts,
      prices: priceVals,
      marketCaps: mcapVals,
      volumes: volVals,
      returns,
      volDelta,
      priceVolatility: stddev(returns),
      last: {
        ts: ts[lastIdx],
        price: priceVals[lastIdx],
        marketCap: mcapVals[lastIdx],
        volume: volVals[lastIdx]
      }
    } as const;

    env.setOutput("Feature Frame", JSON.stringify(frame));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    return false;
  }
}
