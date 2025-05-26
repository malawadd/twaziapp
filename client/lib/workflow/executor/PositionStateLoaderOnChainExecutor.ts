import { ExecutionEnvironment } from "@/types/executor";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import {
  createPublicClient, http, zeroAddress, getContract, toHex, Address
} from "viem";
import { PositionStateLoaderOnChainTask } from "@/lib/workflow/task/PositionStateLoaderOnChainTask";

const erc20Abi = [
  { name:"balanceOf",inputs:[{type:"address"}],outputs:[{type:"uint256"}],stateMutability:"view",type:"function" },
  { name:"decimals",inputs:[],outputs:[{type:"uint8"}],stateMutability:"view",type:"function" },
  { name:"symbol",inputs:[],outputs:[{type:"string"}],stateMutability:"view",type:"function" }
] as const;

// v2 Pair Swap event signature: Swap(address,address,uint256,uint256,uint256,uint256,address)
const SWAP_TOPIC =
  "0xd78ad95fa46c994b6551d0da85fc275fe6138175b7eaa5d4c86e3e6afdc9c6d3";

export async function PositionStateLoaderOnChainExecutor(environment: ExecutionEnvironment<typeof PositionStateLoaderOnChainTask>): Promise<boolean> {
  try {
    /* 1. Wallet address */
    const pkCred = await prisma.credential.findUnique({ where:{ id: environment.getInput("Wallet Credential") }});
    if (!pkCred){ environment.log.error("Wallet credential not found"); return false; }
    const privKey = symmetricDecrypt(pkCred.value).trim();
    const address = `0x${privKey.slice(-40)}`.toLowerCase() as Address;

    /* 2. Setup client */
    const rpc = environment.getInput("RPC Endpoint") || "https://56.rpc.thirdweb.com";
    const client = createPublicClient({ transport: http(rpc) });

    // 3. Grab balances (same as Graph loader)
    /* 3. Resolve tokens from Pair Config */
    const { assetToken, quoteToken } = JSON.parse(environment.getInput("Pair Config"));
    const t0 = assetToken.toLowerCase();
    const t1 = quoteToken.toLowerCase();
    const bal = async (addr: string) => {
      if (addr === zeroAddress) {
        const b = await client.getBalance({ address });
        return { balance: b.toString(), decimals: 18, symbol: "BNB" };
      }
      const c = getContract({ address: addr as any, abi: erc20Abi, client });
      const [raw, dec, sym] = await Promise.all([
        c.read.balanceOf([address]) as any,
        c.read.decimals(),
        c.read.symbol(),
      ]);
      return { balance: raw.toString(), decimals: dec, symbol: sym };
    };
    const [bal0, bal1] = await Promise.all([bal(t0), bal(t1)]);

    // 4. Scan Swap events
    const pairAddr = environment.getInput("Pair Contract") as `0x${string}`;
    const lookback = environment.getInput("Block Look‑back") || 1_000;
    const currentBlock = await client.getBlockNumber();
    const fromBlock = currentBlock - BigInt(lookback);

    const logs = await client.getLogs({
      address: pairAddr,
      fromBlock,
      toBlock: currentBlock,
      // topics: [SWAP_TOPIC, null, null, null, null, null, null, toHex(address)], // wallet as last indexed topic (recipient)
      // Fix: Remove 'topics' property, use event signature filtering if supported by viem, otherwise filter logs after fetching
    });
    // Filter logs for SWAP_TOPIC and recipient address
    const filteredLogs = logs.filter(log => log.topics && log.topics[0] === SWAP_TOPIC && log.topics[log.topics.length - 1] === toHex(address));
    const lastLog = filteredLogs.reverse()[0];
    let lastSwap:any = null;
    if (lastLog) {
      lastSwap = {
        txHash: lastLog.transactionHash,
        block: Number(lastLog.blockNumber),
        data: lastLog.data,
        timestamp: (await client.getBlock({blockNumber:lastLog.blockNumber})).timestamp
      };
    }

    /* 5. Output */
    environment.setOutput("Position State", JSON.stringify({ address, lastSwap, balances:{ [t0]: bal0, [t1]: bal1 }}));
    return true;
  } catch(err:any){ environment.log.error(err.message); return false; }
}
