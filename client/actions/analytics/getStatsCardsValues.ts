"use server";

import prisma from "@/lib/prisma";
import { Period, StatsCardValues } from "@/types/analytics";
import { cookies } from "next/headers";

export async function GetStatsCardsValues(period: Period): Promise<StatsCardValues> {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthorized");
  }

  const startDate = new Date(period.year, period.month, 1);
  const endDate = new Date(period.year, period.month + 1, 0);

  const totalExecutions = await prisma.workflowExecution.count({
    where: {
      userId: address,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalWorkflows = await prisma.workflow.count({
    where: {
      userId: address,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const creditsUsed = await prisma.workflowExecution.aggregate({
    where: {
      userId: address,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      creditsConsumed: true,
    },
  });

  return {
    totalExecutions,
    totalWorkflows,
    creditsUsed: creditsUsed._sum?.creditsConsumed || 0,
  };
}