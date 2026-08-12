import { apiFetch } from "@/lib/api";
import type { WorkspaceInvitation } from "@/types/workspaceInvitation";
import type { WorkspaceRole } from "@/types/workspaceMember";

export const createInvitation = async (
  workspaceId: string,
  email: string,
  role: WorkspaceRole
): Promise<WorkspaceInvitation> => {
  const response = await apiFetch(
    `/workspaces/${workspaceId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }
  );

  return response.invitation;
};

export const getMyInvitations = async (): Promise<WorkspaceInvitation[]> => {
  const response = await apiFetch("/workspaces/invitations/me");

  return response.invitations;
};

export const acceptInvitation = async (token: string) => {
  const response = await apiFetch(
    `/workspaces/invitations/${token}/accept`,
    {
      method: "POST",
    }
  );

  return response;
};

export const declineInvitation = async (token: string) => {
  const response = await apiFetch(
    `/workspaces/invitations/${token}/decline`,
    {
      method: "POST",
    }
  );

  return response;
};