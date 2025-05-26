import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ClipboardCheck, LucideProps } from "lucide-react";

export const ConditionRouterTask = {
  type: TaskType.CONDITION_ROUTER,
  label: "Condition Router (HOLD / PROCEED)",
  icon: (p: LucideProps) => <ClipboardCheck className="stroke-yellow-400" {...p} />,
  isEntryPoint: false,
  credits: 0.2,
  inputs: [
    { name: "Approved Trade Plan", type: TaskParamType.STRING, required: true },
    { name: "Position State", type: TaskParamType.STRING, required: true },
    { name: "Pair Config", type: TaskParamType.STRING, required: true }
  ] as const,
  outputs: [
    { name: "Route", type: TaskParamType.STRING,
      description: "'PROCEED' | 'HOLD' | 'CLOSE_ONLY'" },
    { name: "Forward Trade Plan", type: TaskParamType.STRING,
      description: "The same JSON, passed through for convenience" }
  ] as const
} satisfies WorkflowTask;