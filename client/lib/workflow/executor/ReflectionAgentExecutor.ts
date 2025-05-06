import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { ReflectionAgentTask } from "@/lib/workflow/task/ReflectionAgentTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function ReflectionAgentExecutor(
  environment: ExecutionEnvironment<typeof ReflectionAgentTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("OpenAi Credentials");
    const tradingHistory = environment.getInput("Recent Trading Decisions");
    const prompt = environment.getInput("Prompt") || "Review the recent trading decisions and outcomes. Provide feedback and suggestions for improving future trading performance. Output only a concise feedback string or JSON object.";

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
            "You are a trading strategy reflection agent. Given a history of recent trading decisions and their outcomes (JSON), review the actions, assess their effectiveness, and provide concise, actionable feedback and suggestions for improving future trading decisions. Be objective, focus on learning and improvement, and output only the feedback and suggestions.",
        },
        { role: "user", content: tradingHistory },
        { role: "user", content: prompt },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("empty response from AI");
      return false;
    }
    environment.setOutput("Reflection Feedback", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
