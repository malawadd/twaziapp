import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { OrderFormattingTask } from "@/lib/workflow/task/OrderFormattingTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function OrderFormattingExecutor(
  environment: ExecutionEnvironment<typeof OrderFormattingTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    const riskCheckedDecision = environment.getInput("Risk-Checked Decision");
    const exchangeInfo = environment.getInput("Exchange Info");
    const balances = environment.getInput("Balances");
    const prompt = environment.getInput("Prompt") || "Format the risk-checked trading decision into a valid order for the specified exchange or smart contract. Output only the formatted order as a JSON object ready for execution.";

    const credential = await prisma.credential.findUnique({ where: { id: credentials } });
    if (!credential) { environment.log.error("credential not found"); return false; }
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) { environment.log.error("cannot decrypt credential"); return false; }
    const openai = new OpenAI({ apiKey: plainCredentialValue });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an order formatting agent for algorithmic trading. Given a risk-checked trading decision and exchange/smart contract info, format the order for execution. Output only the formatted order as a JSON object ready for the target platform." },
        { role: "user", content: `Risk-Checked Decision: ${riskCheckedDecision}` },
        { role: "user", content: `Exchange Info: ${exchangeInfo}` },
        { role: "user", content: `Balances: ${balances}` },
        { role: "user", content: prompt },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) { environment.log.error("empty response from AI"); return false; }
    environment.setOutput("Formatted Order", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
