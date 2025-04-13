import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { UploadCloud } from "lucide-react";

export const StoreAIOutputInBucketTask = {
  type: TaskType.STORE_AI_OUTPUT_RECALL,
  label: "Store Streamed AI Output",
  icon: (props) => <UploadCloud className="stroke-green-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Bucket Address",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Full AI Output",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Private Key Credential",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prefix",
      type: TaskParamType.STRING,
      required: false,
    },
  ] as const,
  outputs: [
    {
      name: "Stored Key",
      type: TaskParamType.STRING,
    },
    {
      name: "Tx Hash",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
