"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type { Task } from "@/types/task";
import type { WorkspaceMember } from "@/types/workspaceMember";
import type { Comment } from "@/types/comment";

import {
  getTask,
  updateTask,
  archiveTask,
} from "@/services/taskService";

import { getWorkspaceMembers } from "@/services/memberService";

import {
  getTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment
} from "@/services/taskCommentService";

import TaskHeader from "@/components/task/TaskHeader";
import TaskDescription from "@/components/task/TaskDescription";
import TaskDetails from "@/components/task/TaskDetails";
import TaskNote from "@/components/task/TaskNote";
import TaskAttachments from "@/components/task/TaskAttachments";
import TaskComments from "@/components/task/TaskComments";
import EditTaskModal from "@/components/task/EditTaskModal";

export default function TaskPage() {
  const params = useParams<{
    workspaceId: string;
    projectId: string;
    taskId: string;
  }>();

  const router = useRouter();

  const {
    workspaceId,
    projectId,
    taskId,
  } = params;

  const [task, setTask] = useState<Task | null>(null);

  const [members, setMembers] = useState<
    WorkspaceMember[]
  >([]);

  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    const loadTaskPage = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          taskData,
          memberData,
          commentData,
        ] = await Promise.all([
          getTask(
            workspaceId,
            projectId,
            taskId
          ),
          getWorkspaceMembers(workspaceId),
          getTaskComments(
            workspaceId,
            projectId,
            taskId
          ),
        ]);

        setTask(taskData);
        setMembers(memberData);

        setComments(
          commentData.comments ?? []
        );
      } catch (error) {
        console.error(
          "Failed to load task page:",
          error
        );

        setError(
          "Unable to load this task."
        );
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };

    if (
      workspaceId &&
      projectId &&
      taskId
    ) {
      loadTaskPage();
    }
  }, [
    workspaceId,
    projectId,
    taskId,
  ]);

  const handleTaskUpdate = async (
    data: Parameters<typeof updateTask>[3]
  ) => {
    if (!task) {
      return;
    }

    try {
      const updatedTask =
        await updateTask(
          workspaceId,
          projectId,
          taskId,
          data
        );

      setTask(updatedTask);
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      throw error;
    }
  };

  const handleArchive = async () => {
    if (!task || archiving) {
      return;
    }

    const confirmed = window.confirm(
      "Archive this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setArchiving(true);

      await archiveTask(
        workspaceId,
        projectId,
        taskId
      );

      router.push(
        `/workspaces/${workspaceId}/projects/${projectId}`
      );
    } catch (error) {
      console.error(
        "Failed to archive task:",
        error
      );

      setError(
        "Unable to archive this task."
      );
      setArchiving(false);
    }
  };

  const handleAddComment = async (
    content: string
  ) => {
    const data = await createTaskComment(
      workspaceId,
      projectId,
      taskId,
      {
        content,
      }
    );

    const newComment =
      data.comment ?? data;

    setComments((current) => [
      ...current,
      newComment,
    ]);
  };

  const handleUpdateComment = async (
  commentId: string,
  content: string
) => {
  const data = await updateTaskComment(
    workspaceId,
    projectId,
    taskId,
    commentId,
    { content }
  );

  const updatedComment =
    data.comment ?? data;

  setComments((current) =>
    current.map((comment) =>
      comment._id === commentId
        ? updatedComment
        : comment
    )
  );
};

const handleDeleteComment = async (
  commentId: string
) => {
  await deleteTaskComment(
    workspaceId,
    projectId,
    taskId,
    commentId
  );

  setComments((current) =>
    current.filter(
      (comment) =>
        comment._id !== commentId
    )
  );
};

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 h-5 w-80 animate-pulse rounded bg-gray-100" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[500px] animate-pulse rounded-2xl bg-white" />

            <div className="h-[400px] animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Task not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This task may no longer exist or
            you may not have access to it.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <TaskHeader
          task={task}
          onEdit={() => setEditing(true)}
          onArchive={handleArchive}
        />

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Main content */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT */}
          <div className="min-w-0 space-y-10">
            <TaskDescription
              description={task.description}
            />

            <TaskNote
              workspaceId={workspaceId}
              projectId={projectId}
              taskId={taskId}
            />
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <TaskDetails
              task={task}
              members={members}
              onUpdate={handleTaskUpdate}
              workspaceId={workspaceId}
              projectId={projectId}
            />
          </aside>
        </div>

        {/* Attachments */}
        <TaskAttachments
          workspaceId={workspaceId}
          projectId={projectId}
          taskId={taskId}
        />

        {/* Comments */}
        <TaskComments
        comments={comments}
        loading={commentsLoading}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />
      </div>

      {/* Edit Task Modal */}
      {editing && (
        <EditTaskModal
          task={task}
          workspaceId={workspaceId}
          projectId={projectId}
          onClose={() => setEditing(false)}
          onSuccess={(updatedTask) => {
            setTask(updatedTask);
            setEditing(false);
          }}
        />
      )}
    </main>
  );
}