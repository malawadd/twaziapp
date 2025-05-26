import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileText, LucideProps } from "lucide-react";

export const MergeInputsTask = {
  type: TaskType.MERGE_INPUTS,
  label: "Merge Inputs",
  icon: (props: LucideProps) => <FileText className="stroke-green-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Input 1",
      type: TaskParamType.STRING,
      required: false,
      description: "First input to merge (e.g. price)"
    },
    {
      name: "Input 2",
      type: TaskParamType.STRING,
      required: false,
      description: "Second input to merge (e.g. marketcap)"
    },
    {
      name: "Input 3",
      type: TaskParamType.STRING,
      required: false,
      description: "Third input to merge (e.g. prompt)"
    },
  ] as const,
  outputs: [
    {
      name: "Merged Output",
      type: TaskParamType.STRING,
      description: "A single JSON object containing all provided inputs"
    },
  ] as const,
} satisfies WorkflowTask;
