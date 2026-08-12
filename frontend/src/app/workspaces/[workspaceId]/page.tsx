"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import type { Workspace } from "@/types/workspace";
import type { Project } from "@/types/project";
import type { WorkspaceMember } from "@/types/workspaceMember";

import { getWorkspace } from "@/services/workspaceService";
import { getProjects } from "@/services/projectService";
import { getWorkspaceMembers } from "@/services/memberService";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import ProjectSection from "@/components/workspace/ProjectSection";
import MemberSection from "@/components/workspace/MemberSection";

export default function WorkspacePage() {
  const params = useParams();

  const workspaceId = params.workspaceId as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkspacePage = async () => {
      try {
        const [workspaceData, projectData, memberData] =
          await Promise.all([
            getWorkspace(workspaceId),
            getProjects(workspaceId),
            getWorkspaceMembers(workspaceId),
          ]);

        setWorkspace(workspaceData);

        setProjects(projectData.projects);

       
      } catch (error) {
        console.error("Failed to load workspace:", error);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      loadWorkspacePage();
    }
  }, [workspaceId]);

  const handleCreateProject = () => {
    console.log("Create project clicked");
  };

  const handleInviteMember = () => {
    console.log("Invite member clicked");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="h-80 animate-pulse bg-gray-200" />

          <div className="bg-white px-8 py-7">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-5 w-96 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="px-8 py-10">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Workspace not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This workspace may no longer exist or you may not have access.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <WorkspaceHeader
          workspace={workspace}
          memberCount={members.length}
        />

        <ProjectSection
          projects={projects}
          onCreateProject={handleCreateProject}
        />

        <MemberSection
          members={members}
          currentUserId=""
          onInviteMember={handleInviteMember}
        />
      </div>
    </main>
  );
}