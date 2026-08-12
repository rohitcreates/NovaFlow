import type { WorkspaceRole } from "@/types/workspaceMember";

export type InvitationWorkspace = {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string | null;
};

export type InvitationUser = {
  _id: string;
  name: string;
  email: string;
};

export type WorkspaceInvitation = {
  _id: string;
  workspace: InvitationWorkspace;
  invitedBy: InvitationUser;
  email: string;
  role: WorkspaceRole;
  token: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "cancelled" | "expired";
  createdAt: string;
  updatedAt: string;
};