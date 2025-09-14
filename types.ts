
export interface FormData {
  topic: string;
  grade: string;
  taskType: string;
}

export interface GeneratedTask {
  title: string;
  instructions: string;
  task: string;
  key: string;
  interactiveHtml?: string | null;
}
