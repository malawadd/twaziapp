import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { NewsApiTask } from "@/lib/workflow/task/NewsApiTask";
import { ExecutionEnvironment } from "@/types/executor";

export async function NewsApiExecutor(
  environment: ExecutionEnvironment<typeof NewsApiTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    const keyword = environment.getInput("Keyword");
    // Get credentials from DB
    const credential = await prisma.credential.findUnique({ where: { id: credentials } });
    if (!credential) { environment.log.error("credential not found"); return false; }
    const apiKey = symmetricDecrypt(credential.value);
    if (!apiKey) { environment.log.error("cannot decrypt credential"); return false; }
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&apiKey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) { environment.log.error("NewsAPI request failed"); return false; }
    const data = await res.json();
    if (!data.articles || !Array.isArray(data.articles)) {
      environment.log.error("No articles found");
      return false;
    }
    // Extract required fields
    const articles = data.articles.map((a: any) => ({
      title: a.title,
      description: a.description,
      content: a.content,
      publishedAt: a.publishedAt
    }));
    const urls = data.articles.map((a: any) => a.url).filter(Boolean);
    environment.setOutput("Articles", JSON.stringify(articles));
    environment.setOutput("Article URLs", JSON.stringify(urls));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
