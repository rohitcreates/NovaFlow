import { apiFetch } from "@/lib/api";

export async function getTaskAttachments(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/attachments`
  );
}

export async function uploadTaskAttachment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/attachments`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function deleteTaskAttachment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  attachmentId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,
    {
      method: "DELETE",
    }
  );
}