import { ColorForHandle } from "@/app/workflow/_components/nodes/common";
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "../NodeParamField";
import useFlowValidation from "@/components/hooks/useFlowValidation";

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div className={cn("flex justify-start relative p-3 bg-secondary w-full",
    hasErrors && "bg-destructive/30")}>
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-[3px] !border-black !w-4 !h-4 !-left-4 shadow-[2px_2px_0px_black] rounded-none",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
