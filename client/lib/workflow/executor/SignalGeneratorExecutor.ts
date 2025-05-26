import { ExecutionEnvironment } from "@/types/executor";
import { SignalGeneratorTask } from "@/lib/workflow/task/SignalGeneratorTask";

function toNumber(input: string | undefined, fallback: number): number {
    const parsed = parseFloat(input ?? "");
    return isNaN(parsed) ? fallback : parsed;
  }

export async function SignalGeneratorExecutor(env: ExecutionEnvironment<typeof SignalGeneratorTask>): Promise<boolean> {
  try {
    const strat = JSON.parse(env.getInput("Strategy Choice"));
    const frame = JSON.parse(env.getInput("Feature Frame"));
    const pos   = JSON.parse(env.getInput("Position State"));

    const { assetToken, quoteToken } = JSON.parse(env.getInput("Pair Config"));

    const asset = assetToken.toLowerCase();
    const quote = quoteToken.toLowerCase();

    const sizePct   = toNumber(env.getInput("Trade Size (% of quote)") , 0.1); // 10 %
    const slippageBps = toNumber(env.getInput("Slippage (bps)") , 30); // 0.3 %

    /* Current holdings */
    const quoteBalRaw = BigInt(pos.balances?.[quote]?.balance ?? "0");
    const assetBalRaw = BigInt(pos.balances?.[asset]?.balance ?? "0");
    const quoteDecimals = pos.balances?.[quote]?.decimals ?? 18;
    const assetDecimals = pos.balances?.[asset]?.decimals ?? 18;

    const price = frame.last.price as number; // price in quote per asset

    /** Helper: convert fraction of quote balance to asset amount */
    const calcSize = (): string => {
      const quoteUnit = Number(quoteBalRaw) / 10 ** quoteDecimals;
      const quoteSpend = quoteUnit * sizePct;
      const assetQty = quoteSpend / price;
      return (assetQty * 10 ** assetDecimals).toFixed(0); // raw units as string
    }

    /* Trade plan template */
    const plan: any = {
      action: "HOLD" as const,
      size: "0",          // asset amount in raw units for BUY, or assetBal for SELL
      priceLimit: price * (1 + slippageBps / 10_000), // optimistic default
      stopLoss: null,
      meta: { strategy: strat.strategy }
    };

    /* Decision logic */
    switch (strat.strategy) {
      case "darvas": {
        if (strat.params.direction === "long") {
          if (assetBalRaw === BigInt(0)) {
            // We are flat – generate BUY
            plan.action = "BUY";
            plan.size   = calcSize();
            plan.stopLoss = frame.last.price * 0.97; // 3 % protective stop
          }
          // Already long – HOLD; exit handled by PositionTracker later.
        } else {
          // short breakout – spot cannot short – maybe exit if long
          if (assetBalRaw > BigInt(0)) {
            plan.action = "SELL";
            plan.size   = assetBalRaw.toString();
          }
        }
        break;
      }

      case "range": {
        const half = strat.params.bandHalfWidth as number;
        const lower = frame.last.price - half;
        const upper = frame.last.price + half;
        // If flat & near lower band → buy
        if (assetBalRaw === BigInt(0) && price <= lower * 1.01) {
          plan.action = "BUY";
          plan.size   = calcSize();
          plan.stopLoss = lower * 0.98; // 2 % below band
        }
        // If long & near upper band → sell
        if (assetBalRaw > BigInt(0) && price >= upper * 0.99) {
          plan.action = "SELL";
          plan.size   = assetBalRaw.toString();
        }
        break;
      }
      case "hold":
      default:
        // No trade
        break;
    }

    env.setOutput("Trade Plan", JSON.stringify(plan));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    return false;
  }
}
