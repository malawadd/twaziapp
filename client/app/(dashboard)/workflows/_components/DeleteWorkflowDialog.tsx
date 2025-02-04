"use client";

import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

  interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
    workflowId: string;
  }
  
  function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: Props) {
    const [confirmText, setCofirmText] = useState("")
    const deleteMutation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success("Workflow deleted successfully", {id: workflowId});
            setCofirmText("")
        },
        onError: (error) => {
            toast.error("Failed to delete workflow", {id: workflowId});
        }
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              If you delete this workflow, you will not be able to recover it.
              <div className="flex flex-col py-4 gap-2">
                <p>
                  If you are sure, enter <b>{workflowName}</b> to confirm:
                </p>
                <Input value={confirmText} onChange={e=> setCofirmText(e.target.value)}/>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setCofirmText("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-red-900"
            onClick={() => {
               
                toast.loading("Deleting workflow...", {id: workflowId});
                deleteMutation.mutate(workflowId);
            }}
            >Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  
  export default DeleteWorkflowDialog;
