"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function CheckUserExists() {
  const address = cookies().get("walletAddress")?.value;
  if (!address) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({ 
    where: { userId: address } 
  });

  if (!balance) {
    redirect("/setup");
  }

  return true;
}

