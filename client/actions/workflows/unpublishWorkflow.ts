"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function UnpublishWorkflow(id: string) {
  const address = cookies().get('walletAddress')?.value;
  if (!address) {
    throw new Error("unathenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: address,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("workflow is not published");
  }

  await prisma.workflow.update({
    where: {
      id,
      userId: address,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  revalidatePath(`/workflow/editor/${id}`);
}