"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetWorkflowExecutions(workflowId: string) {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId:address,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
