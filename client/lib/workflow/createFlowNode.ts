import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";

export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "TwaziNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
      isEntryPoint: false,
    },
    position: position ?? { x: 0, y: 0 },
  };
}
