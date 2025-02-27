"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(name: string) {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  await prisma.credential.delete({
    where: {
      userId_name: {
        userId:address,
        name,
      },
    },
  });

  revalidatePath("/credentials");
}
