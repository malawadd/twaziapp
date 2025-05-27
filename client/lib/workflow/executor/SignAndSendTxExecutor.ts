import { ExecutionEnvironment } from "@/types/executor";
import {
  createWalletClient,
  createPublicClient,
  encodeFunctionData,
  http,
  maxUint256,
  parseGwei,
  toHex
} from "viem";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { privateKeyToAccount } from "viem/accounts";
import { SignAndSendTxTask } from "@/lib/workflow/task/SignAndSendTxTask";
import { bsc } from "viem/chains"; 

// minimal ERC-20 ABI
const erc20Abi = [
    {
      name: "allowance",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" }
      ],
      outputs: [{ name: "", type: "uint256" }]
    },
    {
      name: "approve",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" }
      ],
      outputs: [{ name: "", type: "bool" }]
    }
  ] as const;


function toNumber(val: string | undefined, fallback: number) {
  const n = parseFloat(val ?? "");
  return Number.isFinite(n) ? n : fallback;
}

export async function SignAndSendTxExecutor(
  env: ExecutionEnvironment<typeof SignAndSendTxTask>
): Promise<boolean> {
  try {
    /* ---------- early exit ---------- */
    const raw = env.getInput("Tx Data");
    if (raw === "SKIP") {
      env.setOutput("Tx Hash", "SKIP");
      return true;
    }
    const tx = JSON.parse(raw);
    if (typeof tx.value === "string") tx.value = BigInt(tx.value);

    /* ---------- RPC & wallet ---------- */
    const rpc = env.getInput("RPC Endpoint") || "https://56.rpc.thirdweb.com";
    const pkCred = await prisma.credential.findUnique({
      where: { id: env.getInput("Wallet Credential") }
    });
    if (!pkCred) throw new Error("Wallet credential not found");
    const pk = symmetricDecrypt(pkCred.value).trim().replace(/^0x/, "");
    const account = privateKeyToAccount(`0x${pk}` as `0x${string}`);

    const wallet = createWalletClient({ account, transport: http(rpc) });
    const publicC = createPublicClient({ transport: http(rpc) });

    /* ---------- gas price ---------- */
    const gasPrice =
      toNumber(env.getInput("Gas Price (gwei)"), 0) > 0
        ? parseGwei(env.getInput("Gas Price (gwei)")!.toString())
        : await publicC.getGasPrice();

    /* ---------- auto-approve if needed ---------- */
    const isBuy = tx.data.slice(0, 10) === "0x8803dbee"; // swapTokensForExactTokens selector
    const { assetToken, quoteToken } = JSON.parse(
      env.getInput("Pair Config")
    ) as { assetToken: `0x${string}`; quoteToken: `0x${string}` };

    // token we are *spending* this tx
    const spendToken: `0x${string}` = isBuy ? quoteToken : assetToken;
    const amountIn =
      isBuy
        ? BigInt(JSON.parse(env.getInput("Quote Data")).expectedOut)
        : BigInt(JSON.parse(env.getInput("Approved Trade Plan")).size);

    // native BNB needs no approval, only WBNB does
    if (spendToken !== "0x0000000000000000000000000000000000000000") {
      const erc20 = { address: spendToken, abi: erc20Abi, client: publicC };
      const allowance: bigint = (await publicC.readContract({
        ...erc20,
        functionName: "allowance",
        args: [account.address, tx.to]
      })) as any;

      if (allowance < amountIn) {
        // build approve calldata
        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [tx.to as `0x${string}`, maxUint256]
        });
        const approveTx = {
          to: spendToken,
          data: approveData,
          chain: bsc,
          value: BigInt(0)
        };
        const gasApprove = await publicC.estimateGas({
          ...approveTx,
          account
        });
        const hashApprove = await wallet.sendTransaction({
            ...approveTx,
            gas: gasApprove,
            gasPrice,
            account,
        });
        await publicC.waitForTransactionReceipt({ hash: hashApprove });
      }
    }

    /* ---------- estimate + send swap ---------- */
    const gasSwap = await publicC.estimateGas({ ...tx, account });
    const hashSwap = await wallet.sendTransaction({
      ...tx,
      gas: gasSwap,
      gasPrice,
      account
    });

    env.setOutput("Tx Hash", `https://bscscan.com/tx/${hashSwap}`);
    return true;
  } catch (err: any) {
    env.log.error(err.message);
    env.setOutput("Tx Hash", "SKIP");
    return false;
  }
}
