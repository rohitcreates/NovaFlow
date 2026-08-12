import { apiFetch } from "@/lib/api";

export type CreateProjectData = {
  name: string;
  description?: string;
};

export type UpdateProjectData = {
  name?: string;
  description?: string;
  status?: "planning" | "in-progress" | "completed";
};

export async function getProjects(workspaceId: string) {
  return apiFetch(`/workspaces/${workspaceId}/projects`);
}

export async function getProject(
  workspaceId: string,
  projectId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}`
  );
}

export async function createProject(
  workspaceId: string,
  projectData: CreateProjectData
) {
  return apiFetch(`/workspaces/${workspaceId}/projects`, {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export async function updateProject(
  workspaceId: string,
  projectId: string,
  projectData: UpdateProjectData
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}`,
    {
      method: "PATCH",
      body: JSON.stringify(projectData),
    }
  );
}

export async function uploadProjectCover(
  workspaceId: string,
  projectId: string,
  file: File
) {
  const formData = new FormData();
  formData.append("coverImage", file);

  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/cover`,
    {
      method: "PATCH",
      body: formData,
    }
  );
}

export async function archiveProject(
  workspaceId: string,
  projectId: string
) {
  return apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/archive`,
    {
      method: "PATCH",
    }
  );
}