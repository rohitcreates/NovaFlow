import type { User } from "./user";

export type Comment = {
  _id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};