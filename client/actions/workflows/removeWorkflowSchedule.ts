"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function RemoveWorkflowSchedule(id: string) {
  const address = cookies().get("walletAddress")?.value;

  if (!address) {
    throw new Error("unauthenticated");
  }

  await prisma.workflow.update({
    where: {
      id,
      userId: address,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath("/workflows");
}
