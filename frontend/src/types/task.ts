export type TaskStatus =
  | "backlog"
  | "todo"
  | "in progress"
  | "review"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export type TaskAssignee = {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;

  project: string;

  assignees: TaskAssignee[];

  createdBy: string;

  dueDate?: string | null;

  archived: boolean;

  createdAt: string;
  updatedAt: string;
};