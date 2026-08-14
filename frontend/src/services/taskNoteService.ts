import { apiFetch } from "@/lib/api";

export type CreateTaskNoteData = {
  content: string;
};

export type UpdateTaskNoteData = {
  content: string;
};

export async function getTaskNote(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/note`
  );
}

export async function createTaskNote(
  workspaceId: string,
  projectId: string,
  taskId: string,
  data: CreateTaskNoteData
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/note`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateTaskNote(
  workspaceId: string,
  projectId: string,
  taskId: string,
  data: UpdateTaskNoteData
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/note`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}