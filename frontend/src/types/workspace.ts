export type WorkspaceRole = "owner" | "member" | "viewer";
import type { User } from "./auth";

export type Workspace = {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  owner: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

