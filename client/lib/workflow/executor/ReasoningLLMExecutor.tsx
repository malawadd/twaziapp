import { ExecutionEnvironment } from "@/types/executor";
import { ReasoningLLMTask } from "@/lib/workflow/task/ReasoningLLMTask";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";

export async function ReasoningLLMExecutor(
  environment: ExecutionEnvironment<typeof ReasoningLLMTask>
): Promise<boolean> {
  try {
    const rawMessage = environment.getInput("Messages");
    const apiKeyId = environment.getInput("API Key");

    if (!rawMessage || !apiKeyId) {
      environment.log.error("Missing message content or API key input");
      return false;
    }

    const credential = await prisma.credential.findUnique({
      where: { id: apiKeyId },
    });

    if (!credential) {
      environment.log.error("API key credential not found");
      return false;
    }

    const decryptedKey = symmetricDecrypt(credential.value);
    if (!decryptedKey) {
      environment.log.error("Failed to decrypt API key");
      return false;
    }

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: rawMessage },
    ];

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decryptedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: true,
        model: "DeepSeek-R1",
        messages,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const chunks: string[] = [];

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunkText = decoder.decode(value);
      const lines = chunkText.split("data: ").filter(Boolean);

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const content = json?.choices?.[0]?.delta?.content;
          if (content) chunks.push(content);
        } catch {
          // skip invalid JSON
        }
      }
    }

    const full = chunks.join("").trim();

    // 🔍 Extract <think>...</think>
    const thinkStart = full.indexOf("<think>");
    const thinkEnd = full.indexOf("</think>");

    let thinking = "";
    let answer = full;

    if (thinkStart !== -1 && thinkEnd !== -1 && thinkEnd > thinkStart) {
      thinking = full.substring(thinkStart + 7, thinkEnd).trim();
      answer = full.substring(thinkEnd + 8).trim(); // after </think>
    }

    environment.setOutput("Reasoning Output", thinking);
    environment.setOutput("Final Answer", answer);

    return true;
  } catch (error: any) {
    environment.log.error(`[ReasoningLLMExecutor] ${error.message}`);
    return false;
  }
}
