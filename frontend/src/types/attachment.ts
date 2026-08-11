export type TaskAttachment = {
  _id: string;
  task: string;
  uploadedBy: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
};