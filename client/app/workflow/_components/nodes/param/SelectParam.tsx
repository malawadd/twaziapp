"use client";

import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type OptionType = {
  label: string;
  value: string;
};
export default function SelectParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full border-4 border-black shadow-[4px_4px_0px_black] rounded-none bg-white text-black dark:bg-gray-900 dark:text-white 
              hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
    <SelectContent className="border-4 border-black shadow-[4px_4px_0px_black] bg-white dark:bg-gray-900 dark:text-white rounded-none">
          <SelectGroup>
            <SelectLabel className="text-black dark:text-white font-extrabold">Options</SelectLabel>
            {param.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value} className="border-b-2 border-black bg-gray-100 dark:bg-gray-800 hover:bg-yellow-400 dark:hover:bg-yellow-800 text-black dark:text-white 
              hover:translate-x-1 hover:translate-y-1 transition-transform">
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
