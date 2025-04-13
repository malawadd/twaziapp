"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskType } from "@/types/task";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon } from "lucide-react";

export default function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-4 border-black h-full p-2 px-4 overflow-y-auto bg-background overflow-auto shadow-[4px_4px_0px_black] z-60">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "extraction",
          "interactions",
          "timing",
          "results",
          "storage",
        ]}
      >

        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold border-b-2 border-black bg-gray-100 dark:bg-gray-800 dark:text-white shadow-[2px_2px_0px_black] p-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            Data Extraction
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="extraction">
        <AccordionTrigger className="font-bold border-b-2 border-black bg-gray-100 dark:bg-gray-800 dark:text-white shadow-[2px_2px_0px_black] p-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            Recal Tasks
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.CREATE_RECALL_BUCKET} />
            <TaskMenuBtn taskType={TaskType.STORE_AI_OUTPUT_RECALL} />
            

          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold border-b-2 border-black bg-gray-100 dark:bg-gray-800 dark:text-white shadow-[2px_2px_0px_black] p-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            Agents
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-1">
          <TaskMenuBtn taskType={TaskType.REASONING_LLM} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
            
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold border-b-2 border-black bg-gray-100 dark:bg-gray-800 dark:text-white shadow-[2px_2px_0px_black] p-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            web3 tasks
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-1">
          <TaskMenuBtn taskType={TaskType.SMART_CONTRACT_INTERACTION} />
            
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </aside>
  );
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];

  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant={"noShadow"}
      className="flex justify-between items-center gap-2 border-4 border-black shadow-[4px_4px_0px_black] w-full 
  bg-red-400 text-black dark:bg-red-500 dark:text-white hover:bg-red-600 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-transform"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex gap-2 items-center">
        <task.icon size={20} className="text-yellow-500" />
        {task.label}
      </div>
      <Badge className="gap-2 flex items-center border-2 border-black bg-white text-black dark:bg-black dark:text-white dark:border-white shadow-[2px_2px_0px_black]">
        <CoinsIcon size={16} />
        {task.credits}
      </Badge>
    </Button>

  );
}
