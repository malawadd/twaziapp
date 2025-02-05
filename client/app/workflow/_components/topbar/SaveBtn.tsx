"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function SaveBtn({ workflowId }: { workflowId: string }) {



  return (
    <Button
      variant={"default"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Saving workflow...", { id: "save-workflow" });
        
      }}
    >
      <CheckIcon size={16} className="stroke-green-800" />
      Save
    </Button>
  );
}
