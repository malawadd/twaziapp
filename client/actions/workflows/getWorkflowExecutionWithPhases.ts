"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { error } from "console";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId:address,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
