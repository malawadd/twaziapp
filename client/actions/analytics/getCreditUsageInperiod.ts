"use server";

import prisma from "@/lib/prisma";
import { CreditUsage, Period } from "@/types/analytics";
import { cookies } from "next/headers";

export async function GetCreditUsageInPeriod(period: Period): Promise<CreditUsage[]> {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthorized");
  }

  const startDate = new Date(period.year, period.month, 1);
  const endDate = new Date(period.year, period.month + 1, 0);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId: address,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
      creditsConsumed: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date and sum credits
  const usageMap = new Map<string, number>();
  executions.forEach((execution) => {
    const dateKey = execution.createdAt.toISOString().split("T")[0];
    usageMap.set(
      dateKey,
      (usageMap.get(dateKey) || 0) + (execution.creditsConsumed || 0)
    );
  });

  return Array.from(usageMap.entries()).map(([date, credits]) => ({
    date,
    credits,
  }));
}