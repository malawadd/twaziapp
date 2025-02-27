"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const task = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();

  return (
    <div
      className="flex items-center justify-between gap-2 p-4 
      border-4 border-black shadow-[4px_4px_0px_black] 
      bg-white dark:bg-gray-900 dark:text-white 
      hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform 
      rounded-none"
    >
      <div className="flex items-center gap-2">
        <task.icon size={20} className="text-pink-500" />
        <p className="text-sm font-extrabold uppercase">{task.label}</p>
      </div>

      <div className="flex gap-2 items-center">
        {task.isEntryPoint && (
          <>
          <Badge className="border-2 border-black shadow-[2px_2px_0px_black] rounded-none bg-[#a3e636] text-black">
            Entry Point
          </Badge>
          <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            deleteElements({ nodes: [{ id: nodeId }] });
          }}
          className="border-2 border-black shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform bg-red-500 text-white rounded-none"
        >
          <TrashIcon size={14} />
        </Button>
        </>
        )}

        <Badge className="gap-2 flex items-center text-xs border-2 border-black shadow-[2px_2px_0px_black] rounded-none">
          <CoinsIcon size={16} /> {task.credits}
        </Badge>

        {!task.isEntryPoint && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                deleteElements({ nodes: [{ id: nodeId }] });
              }}
              className="border-2 border-black shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform bg-red-500 text-white rounded-none"
            >
              <TrashIcon size={14} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const node = getNode(nodeId) as AppNode;
                const newX = node.position.x;
                const newY = node.position.y + node.measured?.height! + 20;
                const newNode = CreateFlowNode(node.data.type, {
                  x: newX,
                  y: newY,
                });
                addNodes([newNode]);
              }}
              className="border-2 border-black shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform bg-blue-500 text-white rounded-none"
            >
              <CopyIcon size={14} />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="drag-handle cursor-grab border-2 border-black shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform bg-yellow-400 text-black rounded-none"
        >
          <GripVerticalIcon size={20} />
        </Button>
      </div>
    </div>
  );
}

export default NodeHeader;
