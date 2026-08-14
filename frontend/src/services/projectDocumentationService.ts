import { apiFetch } from "@/lib/api";

export async function getProjectDocumentation(
  workspaceId: string,
  projectId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/documentation`
  );
}

export async function updateProjectDocumentation(
  workspaceId: string,
  projectId: string,
  content: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/documentation`,
    {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }
  );
}