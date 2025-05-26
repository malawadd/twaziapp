import { ExecutionEnvironment } from "@/types/executor";
import { PairSelectorTask } from "@/lib/workflow/task/PairSelectorTask";

export async function PairSelectorExecutor(env: ExecutionEnvironment<typeof PairSelectorTask>): Promise<boolean> {
  try {
    const assetInput = env.getInput("Asset Token (buy)");
    const quoteInput = env.getInput("Quote Token (spend)");

    const tokenMap: Record<string, `0x${string}`> = {
      BNB:  "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WBNB
      WBNB: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      USDT: "0x55d398326f99059ff775485246999027b3197955",
      USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      CAKE: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
    };

    const resolve = (token: string): `0x${string}` => {
      if (token.startsWith("0x") && token.length === 42) return token.toLowerCase() as `0x${string}`;
      const addr = tokenMap[token.toUpperCase()];
      if (!addr) throw new Error(`Unknown token symbol: ${token}`);
      return addr;
    };

    const assetAddr = resolve(assetInput);
    const quoteAddr = resolve(quoteInput);

    env.setOutput("Pair Config", JSON.stringify({ assetToken: assetAddr, quoteToken: quoteAddr }));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    return false;
  }
}