import type { User } from "./auth";

export type ProjectDocumentation = {
  _id: string;
  project: string;
  content: string;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
};