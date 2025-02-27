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
import { useQuery } from "@tanstack/react-query";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";

export default function CredentialsParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000, // 10s
  });
  return (
    <div className="flex flex-col gap-2 w-full">
  {/* Label with Required Indicator */}
  <Label htmlFor={id} className="text-xs font-bold flex items-center uppercase text-black dark:text-white">
    {param.name}
    {param.required && <span className="text-red-500 px-2">*</span>}
  </Label>

  {/* Styled Select Dropdown */}
  <Select onValueChange={(value) => updateNodeParamValue(value)} defaultValue={value}>
    <SelectTrigger className="w-full border-4 border-black shadow-[4px_4px_0px_black] rounded-none bg-white text-black dark:bg-gray-900 dark:text-white 
      hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    
    <SelectContent className="border-4 border-black shadow-[4px_4px_0px_black] bg-white dark:bg-gray-900 dark:text-white rounded-none">
      <SelectGroup>
        <SelectLabel className="text-black dark:text-white font-extrabold">Credentials</SelectLabel>
        {query.data?.map((credential) => (
          <SelectItem key={credential.id} value={credential.id} className="border-b-2 border-black bg-gray-100 dark:bg-gray-800 hover:bg-yellow-400 dark:hover:bg-yellow-800 text-black dark:text-white 
            hover:translate-x-1 hover:translate-y-1 transition-transform">
            {credential.name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
</div>

  );
}
