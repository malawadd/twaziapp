"use client";

import { GetPeriods } from "@/actions/analytics/getPeriods";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/types/analytics";
import { useRouter } from "next/navigation";
import React from "react";

export default async function PeriodSelector({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return <PeriodSelectorClient periods={periods} selectedPeriod={selectedPeriod} />;
}

function PeriodSelectorClient({
  periods,
  selectedPeriod,
}: {
  periods: Period[];
  selectedPeriod: Period;
}) {
  const router = useRouter();
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        router.push(`/?month=${month}&year=${year}`);
      }}
    >
      <SelectTrigger className="w-[180px] border-4 border-black shadow-[4px_4px_0px_black] dark:border-[#facc15] dark:text-[#facc15] dark:shadow-[4px_4px_0px_#facc15]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-4 border-black dark:border-[#facc15]">
        {periods.map((period) => (
          <SelectItem
            key={`${period.month}-${period.year}`}
            value={`${period.month}-${period.year}`}
            className="dark:text-[#facc15] dark:focus:bg-[#facc15] dark:focus:text-black"
          >
            {new Date(period.year, period.month).toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}