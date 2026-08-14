"use client";

import { useEffect, useState } from "react";

import type { Comment } from "@/types/comment";
import { getMediaUrl } from "@/lib/media";
import {
  createProjectComment,
  deleteProjectComment,
  getProjectComments,
  updateProjectComment,
} from "@/services/projectCommentService";

type CommentsSectionProps = {
  workspaceId: string;
  projectId: string;
};

export default function CommentsSection({
  workspaceId,
  projectId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectComments(
          workspaceId,
          projectId
        );

        setComments(data);
      } catch (error) {
        console.error(
          "Failed to load project comments:",
          error
        );

        setError("Unable to load comments.");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && projectId) {
      loadComments();
    }
  }, [workspaceId, projectId]);

  const handleCreate = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    try {
      setPosting(true);
      setError("");

      const newComment = await createProjectComment(
        workspaceId,
        projectId,
        trimmedContent
      );

      setComments((current) => [
        ...current,
        newComment,
      ]);

      setContent("");
    } catch (error) {
      console.error(
        "Failed to create project comment:",
        error
      );

      setError("Unable to post your comment.");
    } finally {
      setPosting(false);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditingContent(comment.content);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    const trimmedContent = editingContent.trim();

    if (!trimmedContent) return;

    try {
      setSavingId(commentId);
      setError("");

      const updatedComment =
        await updateProjectComment(
          workspaceId,
          projectId,
          commentId,
          trimmedContent
        );

      setComments((current) =>
        current.map((comment) =>
          comment._id === commentId
            ? updatedComment
            : comment
        )
      );

      setEditingId(null);
      setEditingContent("");
    } catch (error) {
      console.error(
        "Failed to update project comment:",
        error
      );

      setError("Unable to update the comment.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(commentId);
      setError("");

      await deleteProjectComment(
        workspaceId,
        projectId,
        commentId
      );

      setComments((current) =>
        current.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete project comment:",
        error
      );

      setError("Unable to delete the comment.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <section className="pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 4H5a2 2 0 0 0-2 2v14l4-3h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
            Comments
          </h2>

          {!loading && comments.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
              {comments.length}
            </span>
          )}
        </div>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          Discuss ideas, updates, and decisions about
          this project.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="mt-6">
        {loading ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="space-y-5 p-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 4H5a2 2 0 0 0-2 2v14l4-3h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No comments yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
              Start the conversation about this project.
            </p>
          </div>
        ) : (
          <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-gray-200 bg-white">
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => {
                const isEditing =
                  editingId === comment._id;

                const avatarUrl = comment.user?.avatar
                  ? getMediaUrl(comment.user.avatar)
                  : null;

                const initials =
                  comment.user?.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U";

                return (
                  <article
                    key={comment._id}
                    className="p-5 transition-colors hover:bg-gray-50/60"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={`${comment.user?.name ?? "User"} avatar`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {comment.user?.name ||
                              "Unknown user"}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatDate(
                              comment.createdAt
                            )}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="mt-3">
                            <textarea
                              value={editingContent}
                              onChange={(event) =>
                                setEditingContent(
                                  event.target.value
                                )
                              }
                              className="min-h-[110px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                            />

                            <div className="mt-3 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={
                                  handleCancelEdit
                                }
                                disabled={
                                  savingId ===
                                  comment._id
                                }
                                className="rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveEdit(
                                    comment._id
                                  )
                                }
                                disabled={
                                  savingId ===
                                  comment._id
                                }
                                className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {savingId ===
                                comment._id
                                  ? "Saving..."
                                  : "Save Changes"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                              {comment.content}
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartEdit(
                                    comment
                                  )
                                }
                                className="text-xs font-medium text-gray-400 transition hover:text-gray-900"
                              >
                                Edit
                              </button>

                              <span className="text-gray-200">
                                •
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    comment._id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  comment._id
                                }
                                className="text-xs font-medium text-gray-400 transition hover:text-red-600 disabled:opacity-50"
                              >
                                {deletingId ===
                                comment._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-4">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Write a comment..."
            className="min-h-[90px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/60 px-4 py-3">
          <p className="text-xs text-gray-400">
            Share an update, idea, or question.
          </p>

          <button
            type="button"
            onClick={handleCreate}
            disabled={posting || !content.trim()}
            className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </section>
  );
}