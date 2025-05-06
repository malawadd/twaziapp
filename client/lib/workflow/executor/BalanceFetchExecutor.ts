import { createPublicClient, http } from 'viem';
import { BalanceFetchTask } from "@/lib/workflow/task/BalanceFetchTask";
import { ExecutionEnvironment } from "@/types/executor";
import { getChain, getRpcUrl } from "@/lib/helper/chains";

export async function BalanceFetchExecutor(
  environment: ExecutionEnvironment<typeof BalanceFetchTask>
): Promise<boolean> {
  try {
    const address = environment.getInput("Wallet Address");
    const assets = environment.getInput("Assets").split(',').map(a => a.trim());
    const network = environment.getInput("Network");
    let chainConfig;
    let rpcUrl;
    try {
      chainConfig = getChain(network);
      rpcUrl = getRpcUrl(network);
    } catch (e) {
      environment.log.error("Unsupported network");
      return false;
    }
    const client = createPublicClient({
      chain: chainConfig,
      transport: http(rpcUrl),
    });
    const balances: Record<string, string> = {};
    for (const asset of assets) {
      if (asset.startsWith('0x') && asset.length === 42) {
        // ERC20 token
        const balance = await client.readContract({
            // @ts-ignore
          address: asset,
          abi: [
            { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" }
          ],
          functionName: 'balanceOf',
          args: [address],
        });
        // @ts-ignore
        balances[asset] = balance.toString();
      } else {
        // Native token
        // @ts-ignore
        const balance = await client.getBalance({ address });
        balances[asset] = balance.toString();
      }
    }
    environment.setOutput("Balances", JSON.stringify(balances));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
