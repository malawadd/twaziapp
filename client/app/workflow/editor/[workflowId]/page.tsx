
import React from "react";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import Editor from "../../_components/Editor";

async function page({ params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  const address = cookies().get('walletAddress')?.value;
  if (!address) return <div>unauthenticated</div>;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: address,
    },
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={workflow}/>;
}

export default page;
