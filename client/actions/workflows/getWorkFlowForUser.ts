"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetWorkflowsForUser() {
  const address = cookies().get('walletAddress')?.value;

  if (!address) {
    console.log("Unauthenticated");
    console.log(address);
  }
  console.log(address);
  return prisma.workflow.findMany({
    where: {
      userId: address,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
