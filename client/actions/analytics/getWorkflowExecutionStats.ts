"use server";

import prisma from "@/lib/prisma";
import { Period, WorkflowExecutionStats } from "@/types/analytics";
import { cookies } from "next/headers";

export async function GetWorkflowExecutionStats(
  period: Period
): Promise<WorkflowExecutionStats[]> {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthorized");
  }

  const startDate = new Date(period.year, period.month, 1);
  const endDate = new Date(period.year, period.month + 1, 0);

  const executions = await prisma.workflowExecution.groupBy({
    by: ["status"],
    where: {
      userId: address,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      _all: true,
    },
  });

  // Convert to array and format for chart
  return executions.map((execution) => ({
    status: execution.status,
    count: execution._count._all,
  }));
}