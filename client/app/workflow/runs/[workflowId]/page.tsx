import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import ExecutionsTable from "@/app/workflow/runs/[workflowId]/_components/ExecutionsTable";
import { waitFor } from "@/lib/helper/waitFor";
import { exec } from "child_process";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function ExecutionsPage({
  params,
}: {
  params: { workflowId: string };
}) {
  return (
    <div className="h-full w-full overflow-auto bg-background text-foreground">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title="All runs"
        subtitle="List of all your workflow runs"
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon
              size={30}
              className="animate-spin stroke-black dark:stroke-white"
            />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions || executions.length === 0) {
    return (
      <div className="w-full px-6 py-12">
        <div className="flex flex-col items-center justify-center gap-4 border-4 border-black shadow-[6px_6px_0px_black] bg-white dark:bg-[#1a1a1a] text-center p-6 rounded-none">
          <div className="bg-yellow-400 border-4 border-black w-20 h-20 flex items-center justify-center shadow-[4px_4px_0px_black]">
            <InboxIcon size={40} className="stroke-black" />
          </div>
          <p className="text-xl font-bold text-black dark:text-white">
            No runs triggered yet
          </p>
          <p className="text-sm text-muted-foreground">
            Trigger a new run from the editor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 w-full">
      <div className="border-4 border-black rounded-none shadow-[6px_6px_0px_black] bg-white dark:bg-[#1a1a1a] p-2">
        <ExecutionsTable workflowId={workflowId} initialData={executions} />
      </div>
    </div>
  );
}
