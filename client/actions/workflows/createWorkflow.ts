"use server";

import prisma from "@/lib/prisma";
import { CreateWorkflowSchemaType, createWorkflowSchema } from "@/schema/workflow";
import { z } from "zod";
import { cookies } from "next/headers";
import { WorkflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: CreateWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);
    const address = cookies().get('walletAddress')?.value;
    if (!success) {
      throw new Error("invalid form data");
    }
  
    if (!address) {
      throw new Error("unauthenticated");
    }
  
    const result = await prisma.workflow.create({
      data: {
        userId: address,
        status: WorkflowStatus.DRAFT,
        definition: "TODO",
        ...data,
      },
    });

    if (!result) {
      throw new Error("failed to create workflow");
    }

    redirect(`/workflows/editor/${result.id}`)
  }
  