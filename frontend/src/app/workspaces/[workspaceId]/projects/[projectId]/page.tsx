"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import type { Project } from "@/types/project";
import type { WorkspaceMember } from "@/types/workspaceMember";
import type { Task } from "@/types/task";

import { getProject } from "@/services/projectService";
import { getWorkspaceMembers } from "@/services/memberService";
import { getTasks } from "@/services/taskService";

import ProjectHeader from "@/components/project/ProjectHeader";
import CreateTaskModal from "@/components/project/CreateTaskModal";
import TaskSection from "@/components/project/TaskSection";
import DocumentationSection from "@/components/project/DocumentationSection";
import CommentsSection from "@/components/project/CommentsSection";

export default function ProjectPage() {
  const params = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const { workspaceId, projectId } = params;

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [isCreateTaskOpen, setIsCreateTaskOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setTasksLoading(true);

      const taskData = await getTasks(
        workspaceId,
        projectId
      );

      setTasks(taskData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);

        const data = await getProject(
          workspaceId,
          projectId
        );

        setProject(data);

        const memberData =
          await getWorkspaceMembers(workspaceId);

        setMembers(memberData);

        const taskData =
          await getTasks(workspaceId, projectId);

        setTasks(taskData);
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );
      } finally {
        setLoading(false);
        setTasksLoading(false);
      }
    };

    if (workspaceId && projectId) {
      loadProject();
    }
  }, [workspaceId, projectId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-4 h-5 w-96 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Project not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This project may no longer exist or you may
            not have access to it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Project Header */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <ProjectHeader project={project} />

        {/* Project Navigation */}
        <nav className="mt-8 border-b border-gray-200">
          <div className="flex items-center gap-8 overflow-x-auto">
            <a
              href="#tasks"
              className="border-b-2 border-gray-950 pb-4 text-sm font-medium text-gray-950"
            >
              Tasks
            </a>

            <a
              href="#documentation"
              className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
            >
              Documentation
            </a>

            <a
              href="#comments"
              className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
            >
              Comments
            </a>
          </div>
        </nav>
      </div>

      {/* Project Content */}
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Tasks */}
        <section
          id="tasks"
          className="scroll-mt-24 pt-10"
        >
          <TaskSection
            tasks={tasks}
            loading={tasksLoading}
            workspaceId={workspaceId}
            onCreateTask={() =>
              setIsCreateTaskOpen(true)
            }
          />
        </section>

        {/* Documentation */}
        <section
          id="documentation"
          className="scroll-mt-24 pt-16"
        >
          <DocumentationSection
            workspaceId={workspaceId}
            projectId={projectId}
          />
        </section>

        {/* Comments */}
        <section
          id="comments"
          className="scroll-mt-24 pt-16 pb-24"
        >
          <CommentsSection
            workspaceId={workspaceId}
            projectId={projectId}
          />
        </section>
      </div>

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <CreateTaskModal
          workspaceId={workspaceId}
          projectId={projectId}
          members={members}
          onClose={() =>
            setIsCreateTaskOpen(false)
          }
          onSuccess={async () => {
            setIsCreateTaskOpen(false);
            await loadTasks();
          }}
        />
      )}
    </main>
  );
}