"use client";

import { useEffect, useState } from "react";

import type { TaskNote as TaskNoteType } from "@/types/taskNote";

import {
  createTaskNote,
  getTaskNote,
  updateTaskNote,
} from "@/services/taskNoteService";

type TaskNoteProps = {
  workspaceId: string;
  projectId: string;
  taskId: string;
};

export default function TaskNote({
  workspaceId,
  projectId,
  taskId,
}: TaskNoteProps) {
  const [note, setNote] =
    useState<TaskNoteType | null>(null);

  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTaskNote(
          workspaceId,
          projectId,
          taskId
        );

        setNote(data);
        setContent(data.content ?? "");
      } catch (error) {
        console.error(
          "Failed to load task note:",
          error
        );

        /*
         * A task without a note is a valid state.
         * The backend returns 404 when no note exists.
         */
        setNote(null);
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && projectId && taskId) {
      loadNote();
    }
  }, [workspaceId, projectId, taskId]);

  const handleSave = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      let updatedNote;

      if (note) {
        const response = await updateTaskNote(
          workspaceId,
          projectId,
          taskId,
          {
            content: trimmedContent,
          }
        );

        updatedNote = response.note;
      } else {
        const response = await createTaskNote(
          workspaceId,
          projectId,
          taskId,
          {
            content: trimmedContent,
          }
        );

        updatedNote = response.note;
      }

      setNote(updatedNote);
      setContent(updatedNote.content ?? "");
      setEditing(false);
    } catch (error) {
      console.error(
        "Failed to save task note:",
        error
      );

      setError(
        "Unable to save the note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(note?.content ?? "");
    setEditing(false);
    setError("");
  };

  const updatedDate = note?.updatedAt
    ? new Date(note.updatedAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : null;

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-950">
            Note
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Keep important details or working notes for
            this task.
          </p>
        </div>

        {!loading && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
          >
            {note ? "Edit" : "Add Note"}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[360px] rounded-2xl border border-gray-200 bg-white p-6">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-5 h-4 w-full animate-pulse rounded bg-gray-100" />

          <div className="mt-3 h-4 w-11/12 animate-pulse rounded bg-gray-100" />

          <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-gray-100" />
        </div>
      ) : editing ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Write a note for this task..."
            className="min-h-[360px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving || !content.trim()
              }
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white">
          {note?.content?.trim() ? (
            <>
              <div className="max-h-[560px] min-h-[360px] overflow-y-auto px-6 py-7">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {note.content}
                </p>
              </div>

              {updatedDate && (
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-xs text-gray-400">
                    Last updated {updatedDate}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                📝
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                No note yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Add important information, ideas, or
                instructions for this task.
              </p>

              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Add Note
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}