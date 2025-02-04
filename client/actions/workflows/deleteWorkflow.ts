"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function DeleteWorkflow(id: string) {
    const address = cookies().get('walletAddress')?.value;

  if (!address) {
    throw new Error("unauthenticated");
  }

  await prisma.workflow.delete({
    where: {
      id,
      userId:address,
    },
  });

  revalidatePath("/workflows");
}
