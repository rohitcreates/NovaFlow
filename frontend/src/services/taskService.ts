import { apiFetch } from "@/lib/api";

export type CreateTaskData = {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  assignees?: string[];
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?:
    | "backlog"
    | "todo"
    | "in progress"
    | "review"
    | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  assignees?: string[];
};

export async function getTasks(
  workspaceId: string,
  projectId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`
  );
}

export async function getTask(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
  );
}

export async function createTask(
  workspaceId: string,
  projectId: string,
  taskData: CreateTaskData
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify(taskData),
    }
  );
}

export async function updateTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
  taskData: UpdateTaskData
) {
  console.log("UPDATE TASK DATA:", taskData);
  console.trace("UPDATE TASK CALLED FROM:");

  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(taskData),
    }
  );
}

export async function archiveTask(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/archive`,
    {
      method: "PATCH",
    }
  );
}