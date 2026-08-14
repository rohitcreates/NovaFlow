"use client";

import { useState } from "react";

import type { Comment } from "@/types/comment";
import { getMediaUrl } from "@/lib/media";

type TaskCommentsProps = {
  comments: Comment[];
  loading: boolean;
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (
    commentId: string,
    content: string
  ) => Promise<void>;
  onDeleteComment: (
    commentId: string
  ) => Promise<void>;
};

export default function TaskComments({
  comments,
  loading,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: TaskCommentsProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [editingContent, setEditingContent] =
    useState("");

  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      await onAddComment(trimmed);

      setContent("");
    } catch (error) {
      console.error(
        "Failed to add comment:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async () => {
    const trimmed = editingContent.trim();

    if (
      !editingId ||
      !trimmed ||
      savingEdit
    ) {
      return;
    }

    try {
      setSavingEdit(true);

      await onUpdateComment(
        editingId,
        trimmed
      );

      setEditingId(null);
      setEditingContent("");
    } catch (error) {
      console.error(
        "Failed to update comment:",
        error
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (
    commentId: string
  ) => {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(commentId);

      await onDeleteComment(commentId);

      if (editingId === commentId) {
        setEditingId(null);
        setEditingContent("");
      }
    } catch (error) {
      console.error(
        "Failed to delete comment:",
        error
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-950">
          Comments
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Discuss this task with your team.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        {/* Comment input */}
        <form
          onSubmit={handleSubmit}
          className="border-b border-gray-100 p-5"
        >
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Write a comment..."
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={
                submitting ||
                !content.trim()
              }
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? "Posting..."
                : "Add Comment"}
            </button>
          </div>
        </form>

        {/* Comments */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="space-y-4 p-6">
              <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const avatarUrl = getMediaUrl(
                comment.user.avatar
              );

              const initials = comment.user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const isEditing =
                editingId === comment._id;

              return (
                <article
                  key={comment._id}
                  className="p-6"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={comment.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {comment.user.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {new Date(
                            comment.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      {isEditing ? (
                        <div className="mt-3">
                          <textarea
                            value={
                              editingContent
                            }
                            onChange={(event) =>
                              setEditingContent(
                                event.target.value
                              )
                            }
                            rows={3}
                            autoFocus
                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
                          />

                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={
                                handleCancelEdit
                              }
                              disabled={
                                savingEdit
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={
                                handleSaveEdit
                              }
                              disabled={
                                savingEdit ||
                                !editingContent.trim()
                              }
                              className="rounded-lg bg-gray-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {savingEdit
                                ? "Saving..."
                                : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
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
                              className="text-xs font-medium text-red-400 transition hover:text-red-600 disabled:opacity-50"
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
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <h3 className="text-sm font-semibold text-gray-900">
                No comments yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Start the discussion for this task.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}