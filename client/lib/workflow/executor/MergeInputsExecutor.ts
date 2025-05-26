import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";

export const MergeInputsExecutor = async (
  env: ExecutionEnvironment<WorkflowTask & { type: TaskType.MERGE_INPUTS }>
): Promise<boolean> => {
  const input1 = env.getInput("Input 1");
  const input2 = env.getInput("Input 2");
  const input3 = env.getInput("Input 3");

  const merged: Record<string, any> = {};
  if (input1) merged.input1 = input1;
  if (input2) merged.input2 = input2;
  if (input3) merged.input3 = input3;

  env.setOutput("Merged Output", JSON.stringify(merged));
  return true;
};
