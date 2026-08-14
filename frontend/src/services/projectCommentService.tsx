import { apiFetch } from "@/lib/api";
import type { Comment } from "@/types/comment";

type GetCommentsResponse = {
  comments: Comment[];
};

type CommentResponse = {
  message: string;
  comment: Comment;
};

type DeleteCommentResponse = {
  message: string;
};

export async function getProjectComments(
  workspaceId: string,
  projectId: string
): Promise<Comment[]> {
  const data = await apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/comments`
  ) as GetCommentsResponse;

  return data.comments;
}

export async function createProjectComment(
  workspaceId: string,
  projectId: string,
  content: string
): Promise<Comment> {
  const data = await apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  ) as CommentResponse;

  return data.comment;
}

export async function updateProjectComment(
  workspaceId: string,
  projectId: string,
  commentId: string,
  content: string
): Promise<Comment> {
  const data = await apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/comments/${commentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }
  ) as CommentResponse;

  return data.comment;
}

export async function deleteProjectComment(
  workspaceId: string,
  projectId: string,
  commentId: string
): Promise<string> {
  const data = await apiFetch(
    `/workspaces/${workspaceId}/projects/${projectId}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  ) as DeleteCommentResponse;

  return data.message;
}