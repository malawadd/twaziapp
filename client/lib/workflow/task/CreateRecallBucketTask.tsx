import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";
import { LucideProps, TextIcon } from "lucide-react";

export const CreateRecallBucketTask = {
  type: TaskType.CREATE_RECALL_BUCKET,
  label: "Create Recall Bucket",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: true,
  credits: 1,
  inputs: [
    {
      name: "Private Key Credential",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Bucket Address",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
