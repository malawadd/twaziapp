// /lib/workflow/executor/AgentKitSwapExecutor.ts
import { ExecutionEnvironment } from "@/types/executor";
import { AgentKitSwapTask } from "@/lib/workflow/task/AgentKitSwapTask";
import { AgentKitSwapAction } from "@/actions/ai/AgentKitSwapAction";

export async function AgentKitSwapExecutor(
  env: ExecutionEnvironment<typeof AgentKitSwapTask>
) {
  try {
    const cdpApiKeyName = env.getInput("CDP API Key Name");
    const cdpApiKeyPrivateKey = env.getInput("CDP API Key Private Key");
    const fromToken = env.getInput("From Token");
    const toToken = env.getInput("To Token");
    const amount = env.getInput("Amount");

    if (!cdpApiKeyName || !cdpApiKeyPrivateKey || !fromToken || !toToken || !amount) {
      env.log.error("Missing inputs");
      return false;
    }

    // Call the server action logic, but do not store the keys in DB
    const { success, result, error } = await AgentKitSwapAction({
      cdpApiKeyName,
      cdpApiKeyPrivateKey,
      fromToken,
      toToken,
      amount,
    });

    if (!success) {
      env.log.error(`Swap error: ${error}`);
      return false;
    }

    env.setOutput("Swap Transaction Receipt", result ?? "");
    return true;
  } catch (error: any) {
    env.log.error(error.message);
    return false;
  }
}
