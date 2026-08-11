export type ProjectStatus = "active" | "completed" | "archived";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  workspace: string;
  createdBy: string;
  status: ProjectStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};