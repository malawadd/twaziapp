"use server";

import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { cookies } from "next/headers";

export async function GetPeriods(): Promise<Period[]> {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthorized");
  }

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId: address,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get unique periods from executions
  const periodsSet = new Set<string>();
  executions.forEach((execution) => {
    const date = execution.createdAt;
    periodsSet.add(`${date.getMonth()}-${date.getFullYear()}`);
  });

  // Convert to array of Period objects and sort by year and month
  return Array.from(periodsSet)
    .map((periodStr) => {
      const [month, year] = periodStr.split("-").map(Number);
      return { month, year };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}