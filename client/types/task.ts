export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
    EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
    AGENTKIT_SWAP = "AGENTKIT_SWAP",
    SMART_CONTRACT_INTERACTION = "SMART_CONTRACT_INTERACTION",
    CREATE_RECALL_BUCKET = "CREATE_RECALL_BUCKET",
    STORE_AI_OUTPUT_RECALL = "STORE_AI_OUTPUT_RECALL",
    REASONING_LLM = "REASONING_LLM"
}

export enum TaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    SELECT = "SELECT",
    CREDENTIAL = "CREDENTIAL",
  }
  
  export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    value?: string;
    [key: string]: any;
  }
  