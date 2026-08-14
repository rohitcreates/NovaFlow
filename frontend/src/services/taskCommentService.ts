import { apiFetch } from "@/lib/api";

export type CreateTaskCommentData = {
  content: string;
};

export type UpdateTaskCommentData = {
  content: string;
};

export async function getTaskComments(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`
  );
}

export async function createTaskComment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  data: CreateTaskCommentData
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateTaskComment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  data: UpdateTaskCommentData
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteTaskComment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  commentId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
}