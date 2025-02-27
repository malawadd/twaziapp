"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";

function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  nodeId: string;
  isSelected: boolean;
  children: ReactNode;
}) {
  const { getNode, setCenter } = useReactFlow();
    const { invalidInputs } = useFlowValidation();
    const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;

        if (x === undefined || y === undefined) return;

        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "cursor-pointer w-[420px] text-xs gap-2 flex flex-col p-4 border-4 border-black shadow-[4px_4px_0px_black] rounded-none transition-transform hover:shadow-none hover:translate-x-1 hover:translate-y-1",
        "bg-white text-black dark:bg-gray-900 dark:text-white", // Light/Dark theme support
        isSelected && "border-[#a3e636] shadow-[6px_6px_0px_black]",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
