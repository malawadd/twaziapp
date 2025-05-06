import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { NewsAnalystAgentTask } from "@/lib/workflow/task/NewsAnalystAgentTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function NewsAnalystAgentExecutor(
  environment: ExecutionEnvironment<typeof NewsAnalystAgentTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("OpenAi Credentials");
    const newsData = environment.getInput("News Data");
    const prompt = environment.getInput("Prompt") || "Analyze the provided off-chain news, social media, and sentiment data. Summarize the sentiment and any news that may impact the market.";

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
            "You are a crypto news and sentiment analyst. Given JSON-formatted off-chain news, social media, and sentiment data, extract and summarize the most relevant news, events, and sentiment trends that could impact the market. Be objective, avoid speculation, and output only a concise, actionable summary for traders.",
        },
        { role: "user", content: newsData },
        { role: "user", content: prompt },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("empty response from AI");
      return false;
    }
    environment.setOutput("News Analysis Report", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
