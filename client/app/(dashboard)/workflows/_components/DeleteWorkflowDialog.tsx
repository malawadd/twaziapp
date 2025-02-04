"use client";

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
import { useState } from "react";

  interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
  }
  
  function DeleteWorkflowDialog({ open, setOpen, workflowName }: Props) {
    const [confirmText, setCofirmText] = useState("")
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={confirmText !== workflowName}
            className="bg-red-900">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  
  export default DeleteWorkflowDialog;
