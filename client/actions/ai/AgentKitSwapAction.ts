"use server";

import { revalidatePath } from "next/cache";
import {
    AgentKit,
    CdpWalletProvider,
    wethActionProvider,
    walletActionProvider,
    erc20ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
  } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

/**
 * This server action is called by your UI. 
 * It does not store any keys in the DB. The keys are used only for this request.
 */
export async function AgentKitSwapAction({
  cdpApiKeyName,
  cdpApiKeyPrivateKey,
  fromToken,
  toToken,
  amount,
}: {
  cdpApiKeyName: string;
  cdpApiKeyPrivateKey: string;
  fromToken: string;
  toToken: string;
  amount: string;
}) {
  try {
    // 1. Configure MPC wallet from ephemeral keys (no DB storage)
    const walletProvider = await CdpWalletProvider.configureWithWallet({
      apiKeyName: cdpApiKeyName,
      apiKeyPrivateKey: cdpApiKeyPrivateKey,
      networkId: process.env.NETWORK_ID || "base-sepolia",
      // no cdpWalletData means we create a fresh wallet every time
    });

    // 2. Prepare AgentKit + action providers
    const agentKit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        walletActionProvider(),
        wethActionProvider(),
        erc20ActionProvider(),
        pythActionProvider(),
        cdpApiActionProvider({
          apiKeyName: cdpApiKeyName,
          apiKeyPrivateKey: cdpApiKeyPrivateKey,
        }),
        cdpWalletActionProvider({
          apiKeyName: cdpApiKeyName,
          apiKeyPrivateKey: cdpApiKeyPrivateKey,
        }),
      ],
    });

    const tools = await getLangChainTools(agentKit);

    // 3. Create an LLM-based agent (Optional; direct calls are also possible)
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "chatgpt-4o-latest",
    });

    const memory = new MemorySaver();
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are an on-chain swap agent. 
        Swap from ${fromToken} to ${toToken} for an amount of ${amount}.
        Return the transaction hash in your final answer.
      `,
    });

    // 4. Prompt the agent to perform the swap
    const userPrompt = `Perform a token swap:
      From token: ${fromToken}
      To token:   ${toToken}
      Amount:     ${amount}

      Return the transaction hash in your final answer.
    `;

    let finalAnswer = "";
    const responseStream = await agent.stream({ messages: [new HumanMessage(userPrompt)] });

    for await (const chunk of responseStream) {
      if ("agent" in chunk) {
        finalAnswer += chunk.agent.messages[0].content + "\n";
      }
      // If needed, you can also capture "tools" messages
    }

    // 5. finalAnswer likely includes the hash. Or you can parse it out if needed.
    // Because we never store `cdpApiKeyName` or `cdpApiKeyPrivateKey` in DB, 
    // the wallet is ephemeral.

    // Example: revalidate your page if you're showing updated state
    // revalidatePath("/dashboard");

    return { success: true, result: finalAnswer };
  } catch (error: any) {
    console.error("AgentKitSwapAction error:", error);
    return { success: false, error: error.message };
  }
}
