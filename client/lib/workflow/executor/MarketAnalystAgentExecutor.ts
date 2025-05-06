import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { MarketAnalystAgentTask } from "@/lib/workflow/task/MarketAnalystAgentTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function MarketAnalystAgentExecutor(
  environment: ExecutionEnvironment<typeof MarketAnalystAgentTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("OpenAi Credentials");
    const marketData = environment.getInput("Market Data");
    const prompt = environment.getInput("Prompt") || "Analyze the provided on-chain market data and technical indicators. Summarize the current market trend, momentum, and any notable signals for trading.";

    // Get credentials from DB
    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });
    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("cannot decrypt credential");
      return false;
    }
    const openai = new OpenAI({ apiKey: plainCredentialValue });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional crypto market analyst. Given JSON-formatted on-chain market data, technical indicators, and statistics, analyze and summarize the current market trend, momentum, and any notable trading signals. Be concise, objective, and avoid speculation. Output only a clear, actionable summary for traders.",
        },
        { role: "user", content: marketData },
        { role: "user", content: prompt },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("empty response from AI");
      return false;
    }
    environment.setOutput("Market Analysis Report", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
