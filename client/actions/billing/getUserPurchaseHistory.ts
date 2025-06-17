"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetUserPurchaseHistory() {
  const address = cookies().get("walletAddress")?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  return prisma.userPurchase.findMany({
    where: { userId: address },
    orderBy: {
      date: "desc",
    },
  });
}
