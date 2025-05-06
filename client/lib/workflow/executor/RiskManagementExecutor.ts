import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { RiskManagementTask } from "@/lib/workflow/task/RiskManagementTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function RiskManagementExecutor(
  environment: ExecutionEnvironment<typeof RiskManagementTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    const tradingDecision = environment.getInput("Trading Decision");
    const riskParams = environment.getInput("Risk Parameters");
    const prompt = environment.getInput("Prompt") || "Check the trading decision against the provided risk parameters. Adjust allocation, add stop-loss, or reject the trade if it violates risk rules. Output only the risk-checked decision as a JSON object.";

    const credential = await prisma.credential.findUnique({ where: { id: credentials } });
    if (!credential) { environment.log.error("credential not found"); return false; }
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) { environment.log.error("cannot decrypt credential"); return false; }
    const openai = new OpenAI({ apiKey: plainCredentialValue });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a risk management agent for algorithmic trading. Given a trading decision and risk parameters, check for compliance with risk rules (max allocation, stop-loss, exposure limits, etc). Adjust or reject the trade if needed. Output only the risk-checked decision as a JSON object." },
        { role: "user", content: `Trading Decision: ${tradingDecision}` },
        { role: "user", content: `Risk Parameters: ${riskParams}` },
        { role: "user", content: prompt },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) { environment.log.error("empty response from AI"); return false; }
    environment.setOutput("Risk-Checked Decision", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
