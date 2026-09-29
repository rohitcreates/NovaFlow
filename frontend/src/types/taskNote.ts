import type { User } from "./user";

export type TaskNote = {
  _id: string;
  task: string;
  content: string;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
};