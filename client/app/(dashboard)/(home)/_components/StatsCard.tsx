import { LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

interface Props {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  className?: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, className }: Props) {
  return (
    <Card className={`relative overflow-hidden h-full ${className || ''}`}>
      <CardHeader className="flex pb-2 dark:text-black">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className=" dark:text-black text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary dark:text-black">
          <ReactCountUpWrapper value={value} />
        </div>
        <p className="text-sm text-muted-foreground mt-2  dark:text-black">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
