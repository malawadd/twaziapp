"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetWorkflowPhaseDetails(phaseId: string) {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId:address,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}
