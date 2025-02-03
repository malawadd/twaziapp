"use client";

import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers2Icon, Loader2 } from "lucide-react";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { CreateWorkflowSchemaType, createWorkflowSchema } from "@/schema/workflow";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";


function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation(
    {
      mutationFn: CreateWorkflow,
      onSuccess: () => {
        toast.success("Workflow created ", { id: "create-workflow" });
      },
      onError: () => {
        toast.error("Failed to create workflow", { id: "create-workflow" });
      }
    }
  );

  const onSubmit = useCallback((values: CreateWorkflowSchemaType) => {
    toast.loading("Creating workflow...", { id: "create-workflow" });
    mutate(values);
  }, [mutate]);



  return (
    <Dialog open={open} onOpenChange={(open) =>{
      form.reset()
      setOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create Workflow"
          subTitle="Start Building agents workflows" />

        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs ">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a simple desciption with what this workflow is about.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full border-4 border-black bg-[#ff6347] text-white shadow-[4px_4px_0px_black] hover:shadow-none hover:bg-red-500 transition-transform font-extrabold rounded-none"
                disabled={isPending}
              >
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin"/>}
              </Button>
            </form>
          </Form>

        </div>



      </DialogContent>

    </Dialog>
  );
}

export default CreateWorkflowDialog;
