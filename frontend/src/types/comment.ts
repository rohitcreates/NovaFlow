import type { User } from "./auth";

export type Comment = {
  _id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};