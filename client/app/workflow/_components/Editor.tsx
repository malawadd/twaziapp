"use client";

import { Workflow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import { WorkflowStatus } from "@/types/workflow";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import TaskMenu from "./TaskMenu";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";


function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
    <ReactFlowProvider>
       <div className="flex flex-col h-full w-full overflow-hidden">
      <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
            
          />
           <div className="flex flex-row h-full">
          <TaskMenu /> {/* Task Menu on the left */}
          <section className="flex-1 overflow-auto relative">
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </div>
    </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
