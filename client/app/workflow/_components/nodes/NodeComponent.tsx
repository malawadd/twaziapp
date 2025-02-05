import NodeCard from "@/app/workflow/_components/nodes/NodeCard";

import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";

const NodeComponent = memo((props: NodeProps) => {
  
  return (
    <NodeCard nodeId={props.id} children={undefined} >
    
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
