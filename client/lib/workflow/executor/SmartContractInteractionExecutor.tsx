import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { ExecutionEnvironment } from "@/types/executor";
import { SmartContractInteractionTask } from "@/lib/workflow/task/SmartContractInteractionTask";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Address } from "viem"; // Import Address type from viem for better typing

export async function SmartContractInteractionExecutor(
  environment: ExecutionEnvironment<typeof SmartContractInteractionTask>
): Promise<boolean> {
  try {
    // Retrieve inputs
    const abi = environment.getInput("ABI");
    const contractAddress = environment.getInput("Contract Address");
    const functionName = environment.getInput("Function Name");
    const parameters = environment.getInput("Parameters");
    const privateKeyCredential = environment.getInput("Private Key Credential");
    const rpcUrl = environment.getInput("RPC URL");

    // Validate required inputs
    if (!abi || !contractAddress || !functionName || !rpcUrl) {
      environment.log.error("Missing required inputs");
      return false;
    }

    // Parse ABI
    let parsedAbi;
    try {
      parsedAbi = JSON.parse(abi);
    } catch {
      environment.log.error("Invalid ABI");
      return false;
    }

    // Find the function in ABI
    const func = parsedAbi.find(
      (item: any) => item.type === "function" && item.name === functionName
    );
    if (!func) {
      environment.log.error(`Function ${functionName} not found in ABI`);
      return false;
    }

    // Determine if it's a read or write operation
    const isReadFunction =
      func.stateMutability === "view" || func.stateMutability === "pure";

    // Parse parameters
    let params;
    try {
      params = parameters ? JSON.parse(parameters) : { args: [], options: {} };
    } catch {
      environment.log.error("Invalid parameters");
      return false;
    }
    const args = params.args || [];
    const options = params.options || {};

    // Ensure contractAddress is a valid 0xstring (Address type)
    const parsedContractAddress = contractAddress as Address;
    if (!parsedContractAddress.startsWith("0x")) {
      environment.log.error("Invalid contract address: must start with 0x");
      return false;
    }
    console.log("@parsedContractAddress:", parsedContractAddress);

    // Create public client using the provided RPC URL
    const publicClient = createPublicClient({
      transport: http(rpcUrl),
    });

    

    let walletClient: ReturnType<typeof createWalletClient> | undefined;
    if (!isReadFunction) {
      // Write operation requires a private key
      if (!privateKeyCredential) {
        environment.log.error("Private key required for write operations");
        return false;
      }

      // Retrieve and decrypt private key
      const credential = await prisma.credential.findUnique({
        where: { id: privateKeyCredential },
      });
      if (!credential) {
        environment.log.error("Private key credential not found");
        return false;
      }

      const privateKey = symmetricDecrypt(credential.value) as Address;
      if (!privateKey) {
        environment.log.error("Cannot decrypt private key");
        return false;
      }

      const account = privateKeyToAccount(`0x${privateKey}`) ;
      walletClient = createWalletClient({
        account,
        transport: http(rpcUrl),
      });
    }

    // Execute the smart contract interaction
    let result;
    if (isReadFunction) {

      // Read operation
      result = await publicClient.readContract({
        address: parsedContractAddress, // Use typed Address
        abi: parsedAbi,
        functionName,
        args,
      });
      console.log("@Result_before_JSON:", result);
      // Serialize result to JSON
      result = JSON.stringify(result, (key, value) => 
  typeof value === 'bigint' ? value.toString() : value
);
      console.log("@Result_READ:", result);
    } else if (walletClient) {
      // Write operation (ensure walletClient is not undefined)
      const { request } = await publicClient.simulateContract({
        account: walletClient.account,
        address: parsedContractAddress, // Use typed Address
        abi: parsedAbi,
        functionName,
        args,
        value: options.value ? BigInt(options.value) : undefined,
      });
      const txHash = await walletClient.writeContract(request);
      result = txHash;
    } else {
      environment.log.error("Wallet client is not initialized for write operation");
      return false;
    }

    // Set output
    environment.setOutput("Result", result);
    console.log("@Result:", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}