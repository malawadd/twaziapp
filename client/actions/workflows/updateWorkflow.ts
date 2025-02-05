"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const address = cookies().get('walletAddress')?.value;

  if (!address) {
    throw new Error("unathenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId:address,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }

  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId:address,
    },
  });

  revalidatePath("/workflows");
}
