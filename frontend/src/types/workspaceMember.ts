export type WorkspaceRole = "owner" | "member" | "viewer";

export type WorkspaceMemberUser = {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export type WorkspaceMember = {
  _id: string;
  workspace: string;
  user: WorkspaceMemberUser;
  role: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
};