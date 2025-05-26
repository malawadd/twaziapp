import { ExecutionEnvironment } from "@/types/executor";
import { ConditionRouterTask } from "@/lib/workflow/task/ConditionRouterTask";

export async function ConditionRouterExecutor(env: ExecutionEnvironment<typeof ConditionRouterTask>): Promise<boolean> {
  try {
    const plan = JSON.parse(env.getInput("Approved Trade Plan"));
    const pos  = JSON.parse(env.getInput("Position State"));

    const { assetToken, quoteToken } = JSON.parse(env.getInput("Pair Config"));

    const asset = assetToken.toLowerCase();
    const assetBal = BigInt(pos.balances?.[asset]?.balance ?? "0");

    let route: "PROCEED" | "HOLD" | "CLOSE_ONLY" = "HOLD";

    switch (plan.action) {
      case "BUY":
        route = "PROCEED";
        break;
      case "SELL": {
        // If selling entire balance → CLOSE_ONLY (optional shortcut path)
        const planQty = BigInt(plan.size ?? "0");
        route = planQty >= assetBal ? "CLOSE_ONLY" : "PROCEED";
        break;
      }
      case "HOLD":
      default:
        route = "HOLD";
    }

    env.setOutput("Route", route);
    env.setOutput("Forward Trade Plan", JSON.stringify(plan));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    return false;
  }
}
