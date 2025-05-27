import { ExecutionEnvironment } from "@/types/executor";
import { createPublicClient, http, getContract } from "viem";
import { QuoteSlippageTask } from "@/lib/workflow/task/QuoteSlippageTask";

const V2_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E" as const;
const routerAbi = [
  {
    name: "getAmountsOut",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" }
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }]
  }
] as const;

export async function QuoteSlippageExecutor(env: ExecutionEnvironment<typeof QuoteSlippageTask>): Promise<boolean> {
  try {
    const plan = JSON.parse(env.getInput("Approved Trade Plan"));
    if (plan.action === "HOLD") {
      env.setOutput("Quote Data", "SKIP");
      return true;
    }

    const { assetToken, quoteToken } = JSON.parse(env.getInput("Pair Config"));
    const rpc = env.getInput("RPC Endpoint") || "https://56.rpc.thirdweb.com" ;
    const routerAddr = (env.getInput("Router Address") || V2_ROUTER) as `0x${string}`;

    const client = createPublicClient({ transport: http(rpc) });
    const router = getContract({ address: routerAddr, abi: routerAbi, client });

    const amountRaw = BigInt(plan.size);
    let expectedOut: bigint;

    if (plan.action === "BUY") {
      // We know desired asset amount; need quote spend estimate → use getAmountsIn (not in ABI) workaround: binary search not elegant.
      // Simpler: quote 1 quote token to derive price, then compute.
      let oneQuote = BigInt(1);
      for (let i = 0; i < 18; i++) oneQuote *= BigInt(10); // assume 18dec quote; quick est
      const amounts = await router.read.getAmountsOut([oneQuote, [quoteToken, assetToken]]);
      console.log(`AmountsOut for 1 quote: ${amounts}`);
      const price = Number(oneQuote) / Number(amounts[1]); // quote per asset
      console.log(`Price for 1 quote: ${price}`);
      const quoteNeeded = BigInt(Math.ceil(Number(amountRaw) * price));
        console.log(`Quote needed for ${amountRaw} asset: ${quoteNeeded}`);
      expectedOut = quoteNeeded; // For BUY we store quoteNeeded as expectedOutInQuote
    } else {
      // SELL: asset → quote
      const amounts = await router.read.getAmountsOut([amountRaw, [assetToken, quoteToken]]);
      expectedOut = amounts[1]; // quote we’d receive
    }

    // Compute slippage limit from TradePlan.priceLimit (quote per asset)
    const priceLimit = plan.priceLimit ?? 0;
    let slippageOk = true;
    if (priceLimit) {
      if (plan.action === "BUY") {
        // acceptable if average price ≤ limit
        const avgPrice = Number(expectedOut) / Number(amountRaw);
        slippageOk = avgPrice <= priceLimit;
      } else {
        // SELL acceptable if avg price ≥ limit
        const avgPrice = Number(expectedOut) / Number(amountRaw);
        slippageOk = avgPrice >= priceLimit;
      }
    }

    if (!slippageOk) {
        //create a consol warn for all the amount 
        console.log
        console.warn(`action=${plan.action}, expectedOut=${expectedOut}, priceLimit=${priceLimit}`);
        console.warn(`slippageOk: ${JSON.stringify(slippageOk)}`);
      env.setOutput("Quote Data", "SKIP");
      return true;
    }

    const minOut = plan.action === "BUY" ? amountRaw : expectedOut * BigInt(97) / BigInt(100); // 3 % buffer if SELL

    env.setOutput("Quote Data", JSON.stringify({ expectedOut: expectedOut.toString(), minOut: minOut.toString(), slippageOk: true }));
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    env.setOutput("Quote Data", "SKIP");
    return false;
  }
}