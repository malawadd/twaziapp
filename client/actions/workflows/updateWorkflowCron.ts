"use server";

import prisma from "@/lib/prisma";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const address = cookies().get("walletAddress")?.value;

  if (!address) {
    throw new Error("unauthenticated");
  }

  try {
    const interval = parser.parseExpression(cron, { utc: true });
    await prisma.workflow.update({
      where: {
        id,
        userId: address,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("invalid cron:", error.message);
    throw new Error("invalid cron expression");
  }

  revalidatePath("/workflows");
}
