import { apiFetch } from "@/lib/api";
import type {
  WorkspaceMember,
  WorkspaceRole,
} from "@/types/workspaceMember";

export const getWorkspaceMembers = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
  const response = await apiFetch(
    `/workspaces/${workspaceId}/members`
  );

  return response.members;
};

export const removeWorkspaceMember = async (
  workspaceId: string,
  memberId: string
) => {
  return apiFetch(
    `/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: "DELETE",
    }
  );
};

export const updateWorkspaceMemberRole = async (
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole
) => {
  return apiFetch(
    `/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  );
};