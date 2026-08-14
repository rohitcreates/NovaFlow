"use client";

import type { Task } from "@/types/task";
import TaskRow from "@/components/project/TaskRow";

type TaskSectionProps = {
  tasks: Task[];
  loading: boolean;
  workspaceId: string;
  onCreateTask: () => void;
};

export default function TaskSection({
  tasks,
  loading,
  workspaceId,
  onCreateTask,
}: TaskSectionProps) {
  return (
    <section className="pt-10">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
            Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track work for this project.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="shrink-0 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + New Task
        </button>
      </div>

      {/* Task Content */}
      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <h3 className="text-sm font-semibold text-gray-900">
              No tasks yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first task to start working on
              this project.
            </p>

            <button
              type="button"
              onClick={onCreateTask}
              className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Create First Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}