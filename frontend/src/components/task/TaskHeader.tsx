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
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "in progress":
      return "border-violet-200 bg-violet-50 text-violet-700";

    case "review":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "todo":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

function getPriorityClasses(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50 text-red-700";

    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

export default function TaskHeader({
  task,
  onEdit,
  onArchive,
}: TaskHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-7 md:px-8 md:py-9">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          {/* Back */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-base transition-all group-hover:-translate-x-0.5 group-hover:border-gray-300 group-hover:bg-gray-50">
              ←
            </span>

            <span className="hidden sm:inline">
              Back to Project
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M13.5 3.5a2.121 2.121 0 0 1 3 3L7 16H4v-3L13.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="hidden sm:inline">
                Edit Task
              </span>
            </button>

            <button
              type="button"
              onClick={onArchive}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M3.5 6.5h13M5 6.5l.75 10h8.5L15 6.5M7.5 6.5V4.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25V6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 9.5v4M11.5 9.5v4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <span className="hidden sm:inline">
                Archive
              </span>
            </button>
          </div>
        </div>

        {/* Task information */}
        <div className="mt-10">
          {/* Small context label */}
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
              Task
            </span>
          </div>

          {/* Title */}
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.025em] text-gray-950 md:text-4xl lg:text-[2.7rem]">
            {task.title}
          </h1>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                task.status
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {getStatusLabel(task.status)}
            </span>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getPriorityClasses(
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