import { ExecutionEnvironment } from "@/types/executor";
import { CreateRecallBucketTask } from "@/lib/workflow/task/CreateRecallBucketTask";
import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { testnet } from "@recallnet/chains";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function CreateRecallBucketExecutor(
  environment: ExecutionEnvironment<typeof CreateRecallBucketTask>
): Promise<boolean> {
  try {
    const credentialId = environment.getInput("Private Key Credential");
    if (!credentialId) {
      environment.log.error("Missing private key credential");
      return false;
    }

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

    const formattedKey = decryptedKey.startsWith("0x")
      ? decryptedKey
      : `0x${decryptedKey}`;

    const account = privateKeyToAccount(`0x${decryptedKey}`);
    const walletClient = createWalletClient({
      account,
      chain: testnet,
      transport: http(),
    });

    const { RecallClient } = await import("@recallnet/sdk/client");
    const recall = new RecallClient({ walletClient });

    // Ensure user has enough credits
    const creditManager = recall.creditManager();
    const { result: creditBalance } = await creditManager.getCreditBalance();
    const creditFree = Number(creditBalance?.creditFree ?? 0);

    if (creditFree === 0) {
      const { meta } = await creditManager.buy(parseEther("1"));
      environment.log.info(`Bought 1 credit → tx: ${meta?.tx?.transactionHash}`);
    }

    const { result: { bucket } } = await recall.bucketManager().create();
    environment.setOutput("Bucket Address", bucket);
    return true;
  } catch (error: any) {
    environment.log.error(`[CreateRecallBucketExecutor] ${error.message}`);
    return false;
  }
}
