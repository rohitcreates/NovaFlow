"use client";

import type { Task } from "@/types/task";

type TaskHeaderProps = {
  task: Task;
  onEdit: () => void;
  onArchive: () => void;
};

function getStatusLabel(status: Task["status"]) {
  switch (status) {
    case "in progress":
      return "In Progress";
    default:
      return status
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
  }
}

function getStatusClasses(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";

    case "in progress":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "review":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "todo":
      return "bg-amber-50 text-amber-700 border-amber-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function getPriorityClasses(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700 border-red-200";

    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";

    default:
      return "bg-green-50 text-green-700 border-green-200";
  }
}

export default function TaskHeader({
  task,
  onEdit,
  onArchive,
}: TaskHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
          >
            <span className="text-lg">←</span>
            Back to Project
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit Task
            </button>

            <button
              type="button"
              onClick={onArchive}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Archive
            </button>
          </div>
        </div>

        {/* Task title */}
        <div className="mt-8">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
            {task.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                task.status
              )}`}
            >
              {getStatusLabel(task.status)}
            </span>

            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getPriorityClasses(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}