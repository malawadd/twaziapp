"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetCredentialsForUser() {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  return prisma.credential.findMany({
    where: { userId:address },
    orderBy: {
      name: "asc",
    },
  });
}
