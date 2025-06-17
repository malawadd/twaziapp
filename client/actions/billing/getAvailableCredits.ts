"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetAvailableCredits() {
  const address = cookies().get("walletAddress")?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: { userId: address },
  });
  if (!balance) return -1;
  return balance.credits;
}
