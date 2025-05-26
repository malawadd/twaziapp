import { ExecutionEnvironment } from "@/types/executor";
import { BoxRiskManagementTask } from "@/lib/workflow/task/BoxRiskManagementTask";

function toNumber(input: string | undefined, fallback: number): number {
    const parsed = parseFloat(input ?? "");
    return isNaN(parsed) ? fallback : parsed;
  }

export async function BoxRiskManagementExecutor(env: ExecutionEnvironment<typeof BoxRiskManagementTask>): Promise<boolean> {
  try {
    const plan = JSON.parse(env.getInput("Trade Plan"));
    const pos  = JSON.parse(env.getInput("Position State"));
    const frame= JSON.parse(env.getInput("Feature Frame"));

    if (plan.action === "HOLD") { // nothing to vet
      env.setOutput("Approved Trade Plan", JSON.stringify(plan));
      return true;
    }

    // config
    const MAX_POS_PCT =  toNumber(env.getInput("Max Position (%)") , 0.25); // 25 %
    const MAX_RISK_PCT =  toNumber(env.getInput("Max Risk (%)")   , 0.02);  // 2 %
    const MAX_OPEN     =  toNumber(env.getInput("Max Open Trades") , 1);
    const MAX_GAS_Q    =  toNumber(env.getInput("Gas Limit (quote)") , 5);   // e.g., 5 BUSD

    const asset = Object.keys(pos.balances).find(a => a !== frame.quoteToken) || "";
    const quote = frame.quoteToken;

    const assetBal = BigInt(pos.balances?.[asset]?.balance ?? "0");
    const quoteBal = Number(pos.balances?.[quote]?.balance ?? "0") / 10 ** (pos.balances?.[quote]?.decimals ?? 18);
    const entryPrice = frame.last.price as number;
    const plannedAssetRaw = BigInt(plan.size ?? "0");
    const plannedAsset = Number(plannedAssetRaw) / 10 ** (pos.balances?.[asset]?.decimals ?? 18);

    /* 1. Concurrent position guard */
    if (assetBal > 0 && plan.action === "BUY" && MAX_OPEN === 0) {
      plan.action = "HOLD";
      plan.meta.reason = "Already in position";
    }

    /* 2. Position size guard */
    if (plan.action === "BUY") {
      const notional = plannedAsset * entryPrice;
      if (notional > quoteBal * MAX_POS_PCT) {
        // Down‑scale instead of veto
        const allowedAsset = (quoteBal * MAX_POS_PCT) / entryPrice;
        plan.size = (allowedAsset * 10 ** (pos.balances?.[asset]?.decimals ?? 18)).toFixed(0);
        plan.meta.adjusted = true;
      }
    }

    if (plan.action === "SELL") {
        const wantSell = BigInt(plan.size);
        if (wantSell > assetBal) {
          // Down-scale to everything we have
          plan.size = assetBal.toString();
          plan.meta.adjusted = true;
        }
      }

    /* 3. Risk per trade guard (requires stopLoss) */
    if (plan.stopLoss && plan.action === "BUY") {
      const riskPerUnit = entryPrice - plan.stopLoss;
      const riskQuote   = riskPerUnit * plannedAsset;
      if (riskQuote > quoteBal * MAX_RISK_PCT) {
        plan.action = "HOLD";
        plan.meta.reason = "Risk > max risk %";
      }
    }

    /* 4. Gas cost quick check – crude est 0.0005 BNB * priceBNB→quote */
    const gasQuoteEst = 0.0005 * (frame.gasPriceQuote ?? 1); // requires price feed else 1
    if (gasQuoteEst > MAX_GAS_Q) {
      plan.action = "HOLD";
      plan.meta.reason = "Gas > budget";
    }

    env.setOutput("Approved Trade Plan", JSON.stringify(plan));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    return false;
  }
}