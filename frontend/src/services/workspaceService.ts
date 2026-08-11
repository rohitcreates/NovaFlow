import { apiFetch } from "@/lib/api";
import type { Workspace } from "@/types/workspace";

type CreateWorkspaceData = {
  name: string;
  description?: string;
  coverImage?: string;
};

type UpdateWorkspaceData = {
  name?: string;
  description?: string;
  coverImage?: string;
};

export async function getWorkspaces(): Promise<Workspace[]> {
  const data = await apiFetch("/workspaces");

  return data.workspaces;
}

export async function getWorkspace(
  workspaceId: string
): Promise<Workspace> {
  const data = await apiFetch(`/workspaces/${workspaceId}`);

  return data.workspace;
}

export async function createWorkspace(
  workspaceData: CreateWorkspaceData
): Promise<Workspace> {
  const data = await apiFetch("/workspaces", {
    method: "POST",
    body: JSON.stringify(workspaceData),
  });

  return data.workspace;
}

export async function updateWorkspace(
  workspaceId: string,
  workspaceData: UpdateWorkspaceData
): Promise<Workspace> {
  const data = await apiFetch(`/workspaces/${workspaceId}`, {
    method: "PATCH",
    body: JSON.stringify(workspaceData),
  });

  return data.workspace;
}

export async function archiveWorkspace(
  workspaceId: string
): Promise<Workspace> {
  const data = await apiFetch(
    `/workspaces/${workspaceId}/archive`,
    {
      method: "PATCH",
    }
  );

  return data.workspace;
}

export async function uploadWorkspaceCover(
  workspaceId: string,
  file: File
): Promise<Workspace> {
  const formData = new FormData();

  formData.append("coverImage", file);

  const data = await apiFetch(
    `/workspaces/${workspaceId}/cover`,
    {
      method: "PATCH",
      body: formData,
    }
  );

  return data.workspace;
}