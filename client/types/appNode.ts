import { Node } from "@xyflow/react";
import { TaskType } from "./task";

export interface AppNodedata {
    type: TaskType;
    inputs: Record<string,string>;
    [key: string]: any;
}

export interface AppNode extends Node{
    data: AppNodedata;
}