"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import type { Workspace } from "@/types/workspace";
import type { Project } from "@/types/project";
import type { WorkspaceMember } from "@/types/workspaceMember";

import { getWorkspace } from "@/services/workspaceService";

import {
  getProjects,
  createProject,
  updateProject,
  uploadProjectCover,
  archiveProject,
} from "@/services/projectService";

import {
  getWorkspaceMembers,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from "@/services/memberService";

import { createInvitation } from "@/services/invitationService";

import CreateProjectModal from "@/components/workspace/CreateProjectModal";
import InviteMemberModal from "@/components/workspace/InviteMemberModal";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import ProjectSection from "@/components/workspace/ProjectSection";
import MemberSection from "@/components/workspace/MemberSection";

export default function WorkspacePage() {
  const params = useParams();

  const workspaceId = params.workspaceId as string;

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [members, setMembers] =
    useState<WorkspaceMember[]>([]);

  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState(false);

  const [isInviteMemberOpen, setIsInviteMemberOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD WORKSPACE
  // --------------------------------------------------

  useEffect(() => {
    const loadWorkspacePage = async () => {
      try {
        const [
          workspaceData,
          projectData,
          memberData,
        ] = await Promise.all([
          getWorkspace(workspaceId),
          getProjects(workspaceId),
          getWorkspaceMembers(workspaceId),
        ]);

        setWorkspace(workspaceData);
        setProjects(projectData);
        setMembers(memberData);
      } catch (error) {
        console.error(
          "Failed to load workspace:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      loadWorkspacePage();
    }
  }, [workspaceId]);

  // --------------------------------------------------
  // CREATE PROJECT
  // --------------------------------------------------

  const handleCreateProject = async (data: {
    name: string;
    description: string;
    coverImage?: File;
  }) => {
    try {
      const project = await createProject(
        workspaceId,
        {
          name: data.name,
          description: data.description,
        }
      );

      let finalProject = project;

      if (data.coverImage) {
        finalProject =
          await uploadProjectCover(
            workspaceId,
            project._id,
            data.coverImage
          );
      }

      setProjects((currentProjects) => {
        const exists = currentProjects.some(
          (currentProject) =>
            currentProject._id ===
            finalProject._id
        );

        if (exists) {
          return currentProjects.map(
            (currentProject) =>
              currentProject._id ===
              finalProject._id
                ? finalProject
                : currentProject
          );
        }

        return [
          ...currentProjects,
          finalProject,
        ];
      });

      setIsCreateProjectOpen(false);
    } catch (error) {
      console.error(
        "Failed to create project:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // UPDATE PROJECT
  // --------------------------------------------------

  const handleUpdateProject = async (
    projectId: string,
    data: {
      name?: string;
      description?: string;
      status?:
        | "planning"
        | "in-progress"
        | "completed";
      coverImage?: File;
    }
  ) => {
    try {
      const {
        coverImage,
        ...projectData
      } = data;

      let updatedProject = null;

      // Update name / description / status
      if (
        Object.keys(projectData).length > 0
      ) {
        updatedProject =
          await updateProject(
            workspaceId,
            projectId,
            projectData
          );
      }

      // Update cover image
      if (coverImage) {
        updatedProject =
          await uploadProjectCover(
            workspaceId,
            projectId,
            coverImage
          );
      }

      if (!updatedProject) {
        return;
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project._id === projectId
            ? updatedProject
            : project
        )
      );
    } catch (error) {
      console.error(
        "Failed to update project:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // ARCHIVE PROJECT
  // --------------------------------------------------

  const handleArchiveProject = async (
    projectId: string
  ) => {
    try {
      await archiveProject(
        workspaceId,
        projectId
      );

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) =>
            project._id !== projectId
        )
      );
    } catch (error) {
      console.error(
        "Failed to archive project:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // CHANGE MEMBER ROLE
  // --------------------------------------------------

  const handleChangeMemberRole = async (
    memberId: string,
    role: "member" | "viewer"
  ) => {
    try {
      const response =
        await updateWorkspaceMemberRole(
          workspaceId,
          memberId,
          role
        );

      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member.user._id === memberId
            ? response.membership
            : member
        )
      );
    } catch (error) {
      console.error(
        "Failed to update member role:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // REMOVE MEMBER
  // --------------------------------------------------

  const handleRemoveMember = async (
    memberId: string
  ) => {
    try {
      await removeWorkspaceMember(
        workspaceId,
        memberId
      );

      setMembers((currentMembers) =>
        currentMembers.filter(
          (member) =>
            member.user._id !== memberId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove member:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // INVITE MEMBER
  // --------------------------------------------------

  const handleInviteMember = async (data: {
    email: string;
    role: "member" | "viewer";
  }) => {
    try {
      await createInvitation(
        workspaceId,
        data
      );

      setIsInviteMemberOpen(false);
    } catch (error) {
      console.error(
        "Failed to create invitation:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

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

  // --------------------------------------------------
  // WORKSPACE NOT FOUND
  // --------------------------------------------------

  if (!workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Workspace not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This workspace may no longer exist or
            you may not have access.
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <WorkspaceHeader
          workspace={workspace}
          memberCount={members.length}
        />

        <ProjectSection
          projects={projects}
          onCreateProject={() =>
            setIsCreateProjectOpen(true)
          }
          onUpdateProject={
            handleUpdateProject
          }
          onArchiveProject={
            handleArchiveProject
          }
        />

        <MemberSection
          members={members}
          currentUserId=""
          onInviteMember={() =>
            setIsInviteMemberOpen(true)
          }
          onChangeMemberRole={
            handleChangeMemberRole
          }
          onRemoveMember={
            handleRemoveMember
          }
        />
      </div>

      {/* CREATE PROJECT */}

      {isCreateProjectOpen && (
        <CreateProjectModal
          onClose={() =>
            setIsCreateProjectOpen(false)
          }
          onSubmit={
            handleCreateProject
          }
        />
      )}

      {/* INVITE MEMBER */}

      {isInviteMemberOpen && (
        <InviteMemberModal
          onClose={() =>
            setIsInviteMemberOpen(false)
          }
          onSubmit={
            handleInviteMember
          }
        />
      )}
    </main>
  );
}