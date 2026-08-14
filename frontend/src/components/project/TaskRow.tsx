"use client";

import { useRouter } from "next/navigation";

import type { Task } from "@/types/task";
import { getMediaUrl } from "@/lib/media";

type TaskRowProps = {
  task: Task;
  workspaceId: string;
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

function formatDueDate(dueDate?: string | null) {
  if (!dueDate) {
    return null;
  }

  return new Date(dueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getPriorityStyles(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-600 border-red-100";

    case "medium":
      return "bg-amber-50 text-amber-600 border-amber-100";

    case "low":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

export default function TaskRow({
  task,
  workspaceId,
}: TaskRowProps) {
  const router = useRouter();

  const dueDate = formatDueDate(task.dueDate);

  const handleClick = () => {
    router.push(
      `/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-center gap-5">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Title + Description */}
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-950">
              {task.title}
            </h3>

            <p className="mt-1 truncate text-sm text-gray-500">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Status */}
            <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
              {getStatusLabel(task.status)}
            </span>

            {/* Priority */}
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getPriorityStyles(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            {/* Assignees */}
            {task.assignees.length > 0 && (
              <div className="ml-1 flex items-center">
                <div className="flex -space-x-2">
                  {task.assignees
                    .slice(0, 3)
                    .map((assignee) => {
                      const avatarUrl = getMediaUrl(
                        assignee.avatar
                      );

                      const initials = assignee.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={assignee._id}
                          title={assignee.name}
                          className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-100 text-[9px] font-semibold text-gray-500"
                        >
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={assignee.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </div>
                      );
                    })}
                </div>

                {task.assignees.length > 3 && (
                  <span className="ml-2 text-xs font-medium text-gray-500">
                    +{task.assignees.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Due Date */}
            {dueDate && (
              <span className="ml-1 text-xs font-medium text-gray-400">
                Due {dueDate}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition-all duration-200 group-hover:border-gray-300 group-hover:bg-gray-100 group-hover:text-gray-700">
          <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </button>
  );
}