"use client";

import { useState } from "react";

import type { WorkspaceMember } from "@/types/workspaceMember";

import { createTask } from "@/services/taskService";
import { getMediaUrl } from "@/lib/media";

type CreateTaskModalProps = {
  workspaceId: string;
  projectId: string;
  members: WorkspaceMember[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateTaskModal({
  workspaceId,
  projectId,
  members,
  onClose,
  onSuccess,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

 

  const [priority, setPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  const [selectedAssignees, setSelectedAssignees] =
    useState<string[]>([]);

  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }

      return [...current, userId];
    });
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTask(workspaceId, projectId, {
        title: trimmedTitle,
        description: description.trim(),
        
        priority,
        assignees: selectedAssignees,
        dueDate: dueDate || null,
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to create task:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new task to this project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-6">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="text-sm font-medium text-gray-900"
            >
              Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={loading}
              autoFocus
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              placeholder="What needs to be done?"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="text-sm font-medium text-gray-900"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={loading}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              placeholder="Describe what needs to be done..."
            />
          </div>

          {/* Priority */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
           

            <div>
              <label
                htmlFor="task-priority"
                className="text-sm font-medium text-gray-900"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as
                      | "low"
                      | "medium"
                      | "high"
                  )
                }
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              >
                <option value="low">Low</option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <p className="text-sm font-medium text-gray-900">
              Assignees
            </p>

            <div className="mt-2 space-y-2">
              {members.map((member) => {
                const selected =
                  selectedAssignees.includes(
                    member.user._id
                  );

                return (
                  <button
                    key={member.user._id}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      toggleAssignee(
                        member.user._id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    } disabled:opacity-50`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                     {member.user.avatar ? (
                        <img
                            src={getMediaUrl(member.user.avatar) ?? ""}
                            alt={`${member.user.name} avatar`}
                            className="h-full w-full object-cover"
                        />
                        ) : (
                        member.user.name
                          .split(" ")
                          .map(
                            (part) =>
                              part[0]
                          )
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {member.user.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {member.user.email}
                      </p>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                        selected
                          ? "border-gray-950 bg-gray-950 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && "✓"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="text-sm font-medium text-gray-900"
            >
              Due date
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || !title.trim()}
            onClick={handleSubmit}
            className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}