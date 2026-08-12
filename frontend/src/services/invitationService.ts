import { apiFetch } from "@/lib/api";

export type InvitationRole = "member" | "viewer";

export type CreateInvitationData = {
  email: string;
  role: InvitationRole;
};

export const createInvitation = async (
  workspaceId: string,
  data: CreateInvitationData
) => {
  return apiFetch(
    `/workspaces/${workspaceId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const getMyInvitations = async () => {
  const response = await apiFetch(
    "/workspaces/invitations/me"
  );

  return response.invitations;
};

export const acceptInvitation = async (
  token: string
) => {
  return apiFetch(
    `/workspaces/invitations/${token}/accept`,
    {
      method: "POST",
    }
  );
};

export const declineInvitation = async (
  token: string
) => {
  return apiFetch(
    `/workspaces/invitations/${token}/decline`,
    {
      method: "POST",
    }
  );
};