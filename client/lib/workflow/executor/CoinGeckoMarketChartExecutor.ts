import { CoinGeckoMarketChartTask } from "@/lib/workflow/task/CoinGeckoMarketChartTask";
import { ExecutionEnvironment } from "@/types/executor";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";

export async function CoinGeckoMarketChartExecutor(
  environment: ExecutionEnvironment<typeof CoinGeckoMarketChartTask>
): Promise<boolean> {
  try {
    const coinId = environment.getInput("Coin ID");
    let days = environment.getInput("Days");
    const apiKeyId = environment.getInput("API Key");
    if (!days || isNaN(Number(days))) days = "1";
    if (!apiKeyId) {
      environment.log.error("API Key is required");
      return false;
    }
    const credential = await prisma.credential.findUnique({ where: { id: apiKeyId } });
    if (!credential) {
      environment.log.error("API Key credential not found");
      return false;
    }
    const apiKey = symmetricDecrypt(credential.value);
    if (!apiKey) {
      environment.log.error("Cannot decrypt API Key");
      return false;
    }
    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coinId)}/market_chart?vs_currency=usd&days=${days}`;
    const res = await fetch(url, {
      headers: {
        'x-cg-demo-api-key': apiKey
      }
    });
    if (!res.ok) {
      environment.log.error("CoinGecko API request failed");
      return false;
    }
    const data = await res.json();
    environment.setOutput("Prices", JSON.stringify(data.prices || []));
    environment.setOutput("Market Caps", JSON.stringify(data.market_caps || []));
    environment.setOutput("Total Volumes", JSON.stringify(data.total_volumes || []));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
