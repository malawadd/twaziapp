"use server";

import prisma from "@/lib/prisma";
import { CreateWorkflowSchemaType, createWorkflowSchema } from "@/schema/workflow";
import { z } from "zod";
import { cookies } from "next/headers";
import { WorkflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";
import { Edge } from "@xyflow/react";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { AppNode } from "@/types/appNode";

export async function CreateWorkflow(form: CreateWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);
    const address = cookies().get('walletAddress')?.value;
    if (!success) {
      throw new Error("invalid form data");
    }
  
    if (!address) {
      throw new Error("unauthenticated");
    }

    const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    };
  
 
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));
  
  
    const result = await prisma.workflow.create({
      data: {
        userId: address,
        status: WorkflowStatus.DRAFT,
        definition: JSON.stringify(initialFlow),
        ...data,
      },
    });

    if (!result) {
      throw new Error("failed to create workflow");
    }

    redirect(`/workflow/editor/${result.id}`)
  }
  