"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetWorkflowsForUser() {
  const address = cookies().get('walletAddress')?.value;

  if (!address) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflow.findMany({
    where: {
      userId: address,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
