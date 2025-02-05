import NodeCard from "@/app/workflow/_components/nodes/NodeCard";
import NodeHeader from "@/app/workflow/_components/nodes/NodeHeader";
import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { AppNodedata } from "@/types/appNode";
const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodedata;
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected} >
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
    Appnode
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
