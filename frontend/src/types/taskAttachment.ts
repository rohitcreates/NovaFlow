import type { User } from "./user";

export type TaskAttachment = {
  _id: string;
  task: string;
  file: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: User;
  createdAt: string;
};