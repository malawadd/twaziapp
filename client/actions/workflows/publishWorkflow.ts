"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowStatus } from "@/types/workflow";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
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

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("no execution plan generated");
  }

  // For now, use a default credit cost since the helper is not available
  const creditsCost = 1;
  
  await prisma.workflow.update({
    where: {
      id,
      userId: address,
    },
    data: {
      definition: flowDefinition,
      status: WorkflowStatus.PUBLISHED,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
    },
  });

  revalidatePath(`/workflow/editor/${id}`);
}