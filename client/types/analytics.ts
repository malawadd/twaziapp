export interface Period {
  month: number;
  year: number;
}

export interface CreditUsage {
  date: string;
  credits: number;
}

export interface WorkflowExecutionStats {
  status: string;
  count: number;
}

export interface StatsCardValues {
  totalExecutions: number;
  totalWorkflows: number;
  creditsUsed: number;
}
