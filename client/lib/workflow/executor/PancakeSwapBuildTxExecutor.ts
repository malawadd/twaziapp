import { ExecutionEnvironment } from "@/types/executor";
import { encodeFunctionData, parseAbi, Address } from "viem";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { PancakeSwapBuildTxTask } from "@/lib/workflow/task/PancakeSwapBuildTxTask";
import { privateKeyToAccount } from "viem/accounts";
import { bsc } from "viem/chains"; 

const V2_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E" as const;

const routerAbi = parseAbi([
  // swapExactTokensForTokens(uint256,uint256,address[],address,uint256)
  "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline)",
  // swapTokensForExactTokens(uint256,uint256,address[],address,uint256)
  "function swapTokensForExactTokens(uint256 amountOut,uint256 amountInMax,address[] path,address to,uint256 deadline)"
]);

function toNumber(input: string | undefined, fallback: number): number {
    const parsed = parseFloat(input ?? "");
    return isNaN(parsed) ? fallback : parsed;
  }

export async function PancakeSwapBuildTxExecutor(env: ExecutionEnvironment<typeof PancakeSwapBuildTxTask>): Promise<boolean> {
  try {
    const plan = JSON.parse(env.getInput("Approved Trade Plan"));
    const quoteRaw = env.getInput("Quote Data");
    if (plan.action === "HOLD" || quoteRaw === "SKIP") {
      env.setOutput("Tx Data", "SKIP");
      return true;
    }
    const quoteData = JSON.parse(quoteRaw);

    const { assetToken, quoteToken } = JSON.parse(env.getInput("Pair Config"));
    const routerAddr = (env.getInput("Router Address") || V2_ROUTER) as `0x${string}`;
    const deadlineMin = toNumber(env.getInput("Deadline (min)") , 5);
    const deadline = Math.floor(Date.now() / 1000) + deadlineMin * 60;

    // Derive sender address from credential (not signing)
    const pkCred = await prisma.credential.findUnique({ where: { id: env.getInput("Wallet Credential") } });
    if (!pkCred) throw new Error("Wallet credential not found");
    const privKey = symmetricDecrypt(pkCred.value).trim();
        const account = privateKeyToAccount(`0x${privKey}`);
        const sender = account.address as Address;

    let data: `0x${string}`;
    let value: bigint = BigInt(0);
    console.log(value, "value");

    if (plan.action === "BUY") {
      // swapTokensForExactTokens(amountOut, amountInMax, path[])
      const amountOut = BigInt(plan.size);      // desired asset tokens
      const amountInMax = BigInt(quoteData.expectedOut); // quote needed upper bound
      const path = [quoteToken, assetToken] as `0x${string}`[];
      data = encodeFunctionData({ abi: routerAbi, functionName: "swapTokensForExactTokens", args: [amountOut, amountInMax, path, sender, BigInt(deadline)] });
    } else {
      // SELL: swapExactTokensForTokens(amountIn, amountOutMin, path[])
      const amountIn = BigInt(plan.size);       // asset tokens to sell
      const amountOutMin = BigInt(quoteData.minOut); // quote tokens min we accept
      const path = [assetToken, quoteToken] as `0x${string}`[];
      data = encodeFunctionData({ abi: routerAbi, functionName: "swapExactTokensForTokens", args: [amountIn, amountOutMin, path, sender, BigInt(deadline)] });
    }

    const tx = {
      to: routerAddr,
      data,
      value,
      chain: bsc, // BSC mainnet
    };

    console.log("Tx Data:", tx);

    env.setOutput("Tx Data", JSON.stringify(tx, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    env.setOutput("Tx Data", "SKIP");
    return false;
  }
}
