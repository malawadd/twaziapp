"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import { ChevronRightIcon, ClockIcon, CoinsIcon, CornerDownRightIcon, FileTextIcon, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
import TooltipWrapper from "@/components/TooltipWrapper";
import { useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import ExecutionStatusIndicator, { ExecutionStatusLabel } from "@/app/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { formatDistanceToNow } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import SchedulerDialog from "./SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import RunBtn from "./RunBtn";

const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-[#212121] text-white",
    [WorkflowStatus.PUBLISHED]: "bg-primary",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;

    return (
        <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
            <CardContent className="p-4 flex items-center justify-between h-[100px]">
                <div className="flex items-center justify-end space-x-3">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            statusColors[workflow.status as WorkflowStatus]
                        )}
                    >
                        {isDraft ? (
                            <FileTextIcon className="h-5 w-5" />
                        ) : (
                            <PlayIcon className="h-5 w-5 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-muted-foreground flex items-center">
                            <Link
                                href={`/workflow/editor/${workflow.id}`}
                                className="flex items-center hover:underline"
                            >
                                {workflow.name}
                            </Link>
                            {isDraft && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Draft
                                </span>
                            )}
                        </h3>
                        <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                {!isDraft && <RunBtn workflowId={workflow.id} />}
                    <Link
                        href={`/workflow/editor/${workflow.id}`}
                        className={cn(
                            buttonVariants({
                                variant: "neutral",
                                size: "sm",
                            }),
                            "flex items-center gap-2"
                        )}
                    >
                        <ShuffleIcon size={16} />
                        Edit
                    </Link>
                    <WorkflowActions workflowName={workflow.name} workflowId={workflow.id}/>
                </div>
            </CardContent>
            <LastRunDetails workflow={workflow} />
        </Card>
    );
}

function WorkflowActions({workflowName, workflowId}: {workflowName:string, workflowId:string}) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
        <DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflowName} workflowId={workflowId}/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"neutral"} size={"sm"}>
            <TooltipWrapper content={"More actions"}>
                <div className="flex items-center justify-center w-full h-full">
              <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="text-destructive flex items-center gap-2"
            onSelect={()=>{
                setShowDeleteDialog((prev)=>(!prev));
            }}>
                <TrashIcon size={16} />
                Delete
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
                <FileTextIcon size={16} />
                Duplicate 

            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </>
    );
  }

  function ScheduleSection({
    isDraft,
    creditsCost,
    workflowId,
    cron,
  }: {
    isDraft: boolean;
    creditsCost: number;
    workflowId: string;
    cron: string | null;
  }) {
    if (isDraft) return null;
    return (
      <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
        <CornerDownRightIcon className="h-4 w-4" />
        <SchedulerDialog workflowId={workflowId} cron={cron} key={`${cron}-${workflowId}`} />
        <MoveRightIcon className="h-4 w-4" />
        <TooltipWrapper content="Credit consumption for full run">
          <Badge
            variant="default"
            className="flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_black] text-muted-foreground"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </TooltipWrapper>
      </div>
    );
  }
  
  function LastRunDetails({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;
    if (isDraft) return null;
  
    const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  
    const formattedStartedAt =
      lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  
    const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
    const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");
  
    return (
      <div className="border-t-2 border-black px-4 py-2 text-sm text-muted-foreground bg-primary/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {lastRunAt ? (
            <Link
              href={`/workflow/runs/${workflow.id}/${lastRunId}`}
              className="flex items-center gap-2 hover:underline group"
            >
              <span>Last run:</span>
              <ExecutionStatusIndicator status={lastRunStatus as any} />
              <ExecutionStatusLabel status={lastRunStatus as any} />
              <span>{formattedStartedAt}</span>
              <ChevronRightIcon className="transition -translate-x-[2px] group-hover:translate-x-0" size={14} />
            </Link>
          ) : (
            <p>No runs yet</p>
          )}
        </div>
        {nextRunAt && (
          <div className="flex items-center gap-2 text-xs">
            <ClockIcon size={12} />
            <span>Next run:</span>
            <span>{nextSchedule}</span>
            <span className="text-xs">({nextScheduleUTC} UTC)</span>
          </div>
        )}
      </div>
    );
  }

export default WorkflowCard;
