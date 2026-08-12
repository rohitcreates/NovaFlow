export type ProjectStatus =
  | "planning"
  | "in-progress"
  | "completed";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  workspace: string;
  createdBy: string;
  coverImage?: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};