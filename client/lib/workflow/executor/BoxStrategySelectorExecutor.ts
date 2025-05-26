import { ExecutionEnvironment } from "@/types/executor";
import { BoxStrategySelectorTask } from "@/lib/workflow/task/BoxStrategySelectorTask";

function median(arr: number[]) {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function toNumber(input: string | undefined, fallback: number): number {
    const parsed = parseFloat(input ?? "");
    return isNaN(parsed) ? fallback : parsed;
  }

export async function BoxStrategySelectorExecutor(env: ExecutionEnvironment<typeof BoxStrategySelectorTask>): Promise<boolean> {
  try {
    const frame = JSON.parse(env.getInput("Feature Frame"));

    // unwrap data
    const returns: number[] = frame.returns || [];
    const volumes: number[] = frame.volumes || [];
    const volDelta: number[] = frame.volDelta || [];
    const sigma: number = frame.priceVolatility || 0;

    if (returns.length < 2) throw new Error("Not enough data for strategy evaluation");

    const lastRet = returns[returns.length - 1];
    const lastVolDelta = volDelta[volDelta.length - 1];
    const medVol = median(volumes);

    // thresholds (defaults if not provided)
    const VOL_TH = toNumber(env.getInput("Volatility Threshold (range)"), 0.015);; // 1.5 %
    const RET_TH = toNumber(env.getInput("Breakout Return Threshold"), 0.005); // 0.5 %
    const VOL_SURGE = toNumber(env.getInput("Volume Surge Factor"), 0.5); // 50 % above median

    let strategy: "darvas" | "range" | "hold" = "hold";
    const params: Record<string, any> = {};

    // Decision tree
    if (Math.abs(lastRet) >= RET_TH && sigma >= VOL_TH) {
      // Price moved decisively; check volume confirmation
      if (lastVolDelta / medVol >= VOL_SURGE) {
        strategy = "darvas";
        params.direction = lastRet > 0 ? "long" : "short";
        params.breakoutReturn = lastRet;
      }
    }

    if (strategy === "hold") {
      // Low-volatility sideways → range boxing
      if (sigma <= VOL_TH && Math.abs(lastRet) < RET_TH) {
        strategy = "range";
        params.bandHalfWidth = sigma; // use volatility as band size proxy
      }
    }

    const out = JSON.stringify({ strategy, params });
    env.setOutput("Strategy Choice", out);
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    return false;
  }
}