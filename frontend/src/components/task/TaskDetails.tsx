"use client";

import { useState } from "react";
import AssigneeSelector from "./AssigneeSelector";
import type { Task } from "@/types/task";
import type { WorkspaceMember } from "@/types/workspaceMember";
import type { UpdateTaskData } from "@/services/taskService";

import { getMediaUrl } from "@/lib/media";

type TaskDetailsProps = {
  task: Task;
  members: WorkspaceMember[];
  workspaceId: string;
  projectId: string;
  onUpdate: (
    data: UpdateTaskData
  ) => Promise<void>;

};

function formatDate(date?: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskDetails({
  task,
  members,
  workspaceId,
  projectId,
  onUpdate,
}: TaskDetailsProps) {
  const [updatingField, setUpdatingField] = useState<
  "status" | "priority" | null
>(null);

const handleStatusChange = async (
  status: Task["status"]
) => {
  if (status === task.status) {
    return;
  }

  try {
    setUpdatingField("status");

    await onUpdate({
      status,
    });
  } catch (error) {
    console.error(
      "Failed to update task status:",
      error
    );
  } finally {
    setUpdatingField(null);
  }
};

const handlePriorityChange = async (
  priority: Task["priority"]
) => {
  if (priority === task.priority) {
    return;
  }

  try {
    setUpdatingField("priority");

    await onUpdate({
      priority,
    });
  } catch (error) {
    console.error(
      "Failed to update task priority:",
      error
    );
  } finally {
    setUpdatingField(null);
  }
};

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-950">
          Task Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Information about this task.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Status */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>

            {updatingField === "status" && (
              <span className="text-xs text-gray-400">
                Saving...
              </span>
            )}
          </div>

          <div className="mt-2">
            <select
              value={task.status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as Task["status"]
                )
              }
              disabled={updatingField !== null}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition hover:border-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="backlog">
                Backlog
              </option>

              <option value="todo">
                Todo
              </option>

              <option value="in progress">
                In Progress
              </option>

              <option value="review">
                Review
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>
        </div>

        {/* Priority */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Priority
            </p>

            {updatingField === "priority" && (
              <span className="text-xs text-gray-400">
                Saving...
              </span>
            )}
          </div>

          <div className="mt-2">
            <select
              value={task.priority}
              onChange={(event) =>
                handlePriorityChange(
                  event.target.value as Task["priority"]
                )
              }
              disabled={updatingField !== null}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium capitalize text-gray-800 outline-none transition hover:border-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>
        </div>

        {/* Assignees */}
        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Assignees
          </p>

          <div className="mt-3">
            <AssigneeSelector
              task={task}
              workspaceId={workspaceId}
              projectId={projectId}
              members={members}
              onUpdated={async () => {
                await onUpdate({
                  assignees: task.assignees.map(
                    (assignee) => assignee._id
                  ),
                });
              }}
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Due Date
          </p>

          <p className="mt-2 text-sm font-medium text-gray-900">
            {formatDate(task.dueDate)}
          </p>
        </div>

        {/* Created */}
        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Created
          </p>

          <p className="mt-2 text-sm text-gray-700">
            {formatDate(task.createdAt)}
          </p>
        </div>

        {/* Updated */}
        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Last Updated
          </p>

          <p className="mt-2 text-sm text-gray-700">
            {formatDate(task.updatedAt)}
          </p>
        </div>
      </div>
    </aside>
  );
}