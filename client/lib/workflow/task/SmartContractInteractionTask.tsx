import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LinkIcon } from "lucide-react"; // Assuming a suitable icon for smart contracts

export const SmartContractInteractionTask = {
  type: TaskType.SMART_CONTRACT_INTERACTION,
  label: "Interact with Smart Contract",
  icon: (props) => <LinkIcon className="stroke-blue-400" {...props} />,
  isEntryPoint: true,
  credits: 0, // Adjust based on platform requirements
  inputs: [
    {
      name: "ABI",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea", // Suitable for large JSON strings
    },
    {
      name: "Contract Address",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Function Name",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Parameters",
      type: TaskParamType.STRING,
      required: false,
      variant: "textarea", // JSON string for args and options
    },
    {
      name: "Private Key Credential",
      type: TaskParamType.CREDENTIAL,
      required: false, // Required only for write operations
    },
    {
      name: "RPC URL",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Result",
      type: TaskParamType.STRING, // Read result (JSON) or transaction hash
    },
  ],
} satisfies WorkflowTask;