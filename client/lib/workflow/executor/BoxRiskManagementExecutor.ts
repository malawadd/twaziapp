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
    const GAS_BUDGET    =  toNumber(env.getInput("Gas Limit (quote)") , 5);   // e.g., 5 BUSD

    // Addresses
    const { assetToken, quoteToken } = JSON.parse(env.getInput("Pair Config"));
    const assetAddr  = assetToken.toLowerCase();
    const quoteAddr  = quoteToken.toLowerCase();

    // Balances & decimals
    const assetBalRaw  = BigInt(pos.balances?.[assetAddr]?.balance ?? "0");
    const assetDec     = pos.balances?.[assetAddr]?.decimals ?? 18;
    const quoteBalRaw  = BigInt(pos.balances?.[quoteAddr]?.balance ?? "0");
    const quoteDec     = pos.balances?.[quoteAddr]?.decimals ?? 18;

    const quoteBal     = Number(quoteBalRaw)  / 10 ** quoteDec;
    const assetBal     = Number(assetBalRaw)  / 10 ** assetDec;
    const entryPrice   = frame.last.price as number; // quote per asset

    // How many spot positions already?  (non‑zero asset balance = 1)
    const openCount    = assetBal > 0 ? 1 : 0;

    /* 1 ▸ position count guard */
    if (plan.action === "BUY" && openCount >= MAX_OPEN) {
    plan.action = "HOLD";
    plan.meta.reason = "Max open trades reached";
    }

    /* 2 ▸ position size guard */
    if (plan.action === "BUY") {
    const sizeRaw      = BigInt(plan.size);
    const sizeAsset    = Number(sizeRaw) / 10 ** assetDec;
    const notional     = sizeAsset * entryPrice;
    const allowedCash  = quoteBal * MAX_POS_PCT;
    if (notional > allowedCash) {
        // Shrink rather than cancel
        const newSizeAsset = allowedCash / entryPrice;
        plan.size = (newSizeAsset * 10 ** assetDec).toFixed(0);
        plan.meta.adjusted = true;
    }
    }

    /* 3 ▸ risk‑per‑trade guard */
    if (plan.stopLoss && plan.action === "BUY") {
    const riskPerUnit = entryPrice - plan.stopLoss;
    const sizeAsset   = Number(BigInt(plan.size)) / 10 ** assetDec;
    const riskQuote   = riskPerUnit * sizeAsset;
    const equityQuote = quoteBal + assetBal * entryPrice;
    if (riskQuote > equityQuote * MAX_RISK_PCT) {
        plan.action = "HOLD";
        plan.meta.reason = "Risk > limit";
    }
    }

    /* 4 ▸ gas worth‑it guard (flat 0.0005 BNB gas, convert using price if asset is BNB) */
    const GAS_BNB = 0.0005;
    const bnbPriceQuote = frame.last.price; // frame is WBNB/USDT in example
    const gasQuoteEst = GAS_BNB * bnbPriceQuote;
    if (gasQuoteEst > GAS_BUDGET) {
    plan.action = "HOLD";
    plan.meta.reason = "Gas > budget";
    }

    env.setOutput("Approved Trade Plan", JSON.stringify(plan));
    return true;
    } catch (err:any) {
    env.log.error(err.message);
    return false;
    }
    }