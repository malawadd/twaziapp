import { ExecutionEnvironment } from "@/types/executor";
import { StoreAIOutputInBucketTask } from "@/lib/workflow/task/StoreAIOutputInBucketTask";
import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { testnet } from "@recallnet/chains";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function StoreAIOutputInBucketExecutor(
  environment: ExecutionEnvironment<typeof StoreAIOutputInBucketTask>
): Promise<boolean> {
  try {
    const bucket = environment.getInput("Bucket Address");
    const aiOutput = environment.getInput("Full AI Output");
    const credentialId = environment.getInput("Private Key Credential");
    const prefix = environment.getInput("Prefix") || "ai-streams";

    if (!bucket || !aiOutput || !credentialId) {
      environment.log.error("Missing required inputs");
      return false;
    }

    // Get decrypted private key
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const decryptedKey = symmetricDecrypt(credential.value);
    if (!decryptedKey) {
      environment.log.error("Failed to decrypt private key");
      return false;
    }

    const formattedKey = decryptedKey.startsWith("0x") ? decryptedKey : `0x${decryptedKey}`;
    const account = privateKeyToAccount(`0x${decryptedKey}`);

    const walletClient = createWalletClient({
      account,
      chain: testnet,
      transport: http(),
    });

    const { RecallClient } = await import("@recallnet/sdk/client");
    const recall = new RecallClient({ walletClient });

    // Ensure credit
    const creditManager = recall.creditManager();
    const { result: creditBalance } = await creditManager.getCreditBalance();
    const creditFree = Number(creditBalance?.creditFree ?? 0);

    if (creditFree === 0) {
      const { meta } = await creditManager.buy(parseEther("1"));
      environment.log.info(`Bought 1 credit → tx: ${meta?.tx?.transactionHash}`);
    }

    // Upload file
    const bucketManager = recall.bucketManager();
    const key = `${prefix}/${Date.now()}.txt`;
    const buffer = Buffer.from(aiOutput, "utf-8");
    // @ts-ignore
    const { meta } = await bucketManager.add(bucket, key, buffer);
    const txHash = meta?.tx?.transactionHash;

    environment.setOutput("Stored Key", key);
    // @ts-ignore
    environment.setOutput("Tx Hash",txHash);
    return true;
  } catch (error: any) {
    environment.log.error(`[StoreAIOutputInBucketExecutor] ${error.message}`);
    return false;
  }
}
