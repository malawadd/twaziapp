import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { NewsAISearchTask } from "@/lib/workflow/task/NewsAISearchTask";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";

export async function NewsAISearchExecutor(
  environment: ExecutionEnvironment<typeof NewsAISearchTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    const searchQuery = environment.getInput("Search Query");
    const model = environment.getInput("Model") || "gpt-4.1";

    // Get credentials from DB
    const credential = await prisma.credential.findUnique({ where: { id: credentials } });
    if (!credential) { environment.log.error("credential not found"); return false; }
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) { environment.log.error("cannot decrypt credential"); return false; }
    const openai = new OpenAI({ apiKey: plainCredentialValue });
    const response = await openai.responses.create({
      model,
      tools: [ { type: "web_search_preview" } ],
      input: searchQuery,
    });
    // Extract the message content with citations
    let result = "";
    if (Array.isArray(response) && response.length > 0) {
      const message = response.find((item: any) => item.type === "message");
      if (message && message.content && message.content[0] && message.content[0].text) {
        result = message.content[0].text;
      }
    } else if (response.output_text) {
      result = response.output_text;
    }
    if (!result) { environment.log.error("empty response from AI"); return false; }
    environment.setOutput("News Search Result", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
