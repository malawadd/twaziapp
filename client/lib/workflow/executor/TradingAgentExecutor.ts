import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { TradingAgentTask } from "@/lib/workflow/task/TradingAgentTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function TradingAgentExecutor(
  environment: ExecutionEnvironment<typeof TradingAgentTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("OpenAi Credentials");
    const marketReport = environment.getInput("Market Analysis Report");
    const newsReport = environment.getInput("News Analysis Report");
    const prompt = environment.getInput("Prompt") || "Given the market and news analysis, make a trading decision (buy, sell, hold) with rationale and allocation. Output only a JSON object with decision, rationale, and allocation.";

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
            "You are an autonomous crypto trading agent. Given a market analysis report and a news analysis report, synthesize the information and make a clear trading decision: Buy, Sell, or Hold. Justify your decision with a concise rationale and specify the recommended allocation. Output only the decision, rationale, and allocation in a structured format for execution.",
        },
        { role: "user", content: `Market Analysis: ${marketReport}` },
        { role: "user", content: `News Analysis: ${newsReport}` },
        { role: "user", content: prompt },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("empty response from AI");
      return false;
    }
    environment.setOutput("Trading Decision", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
