import type { User } from "./auth";

export type TaskNote = {
  _id: string;
  task: string;
  content: string;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
};