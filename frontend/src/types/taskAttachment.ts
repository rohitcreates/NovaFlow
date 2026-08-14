import type { User } from "./auth";

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