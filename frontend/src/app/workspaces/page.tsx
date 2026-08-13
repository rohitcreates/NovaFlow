"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { Workspace } from "@/types/workspace";

import { getWorkspaces } from "@/services/workspaceService";

import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import CreateWorkspaceModal from "@/components/workspace/CreateWorkspaceModal";
import EditWorkspaceModal from "@/components/workspace/EditWorkspaceModal";
import ArchiveWorkspaceModal from "@/components/workspace/ArchiveWorkspaceModal";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingWorkspace, setEditingWorkspace] =
    useState<Workspace | null>(null);

  const [archivingWorkspace, setArchivingWorkspace] =
    useState<Workspace | null>(null);

  const [changingCoverWorkspace, setChangingCoverWorkspace] =
    useState<Workspace | null>(null);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWorkspaces();

      setWorkspaces(data);
    } catch (error) {
      console.error("Error loading workspaces:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load workspaces."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleCreated = (workspace: Workspace) => {
    setWorkspaces((current) => [
      workspace,
      ...current,
    ]);
  };

  const handleUpdated = (workspace: Workspace) => {
    setWorkspaces((current) =>
      current.map((item) =>
        item._id === workspace._id
          ? workspace
          : item
      )
    );
  };

  const handleArchived = (workspace: Workspace) => {
    setWorkspaces((current) =>
      current.filter(
        (item) => item._id !== workspace._id
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      

      {/* Main */}
      <main className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-10 flex items-end justify-between gap-8">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Workspace
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
                Your Workspaces
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Manage your projects, tasks, documentation,
                and collaboration from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="
                shrink-0
                rounded-xl
                bg-gray-950
                px-5 py-3
                text-sm font-medium
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-gray-800
                hover:shadow-lg
              "
            >
              + New Workspace
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-80
                    animate-pulse
                    rounded-3xl
                    border border-black/5
                    bg-white
                  "
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <h2 className="font-semibold text-red-900">
                Something went wrong
              </h2>

              <p className="mt-2 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadWorkspaces}
                className="
                  mt-5
                  rounded-xl
                  bg-red-900
                  px-4 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-red-800
                "
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            workspaces.length === 0 && (
              <div
                className="
                  flex min-h-[420px]
                  flex-col
                  items-center
                  justify-center
                  rounded-3xl
                  border border-dashed
                  border-gray-300
                  bg-white
                  px-6
                  text-center
                "
              >
                <div className="mb-5 text-5xl text-gray-300">
                  ◫
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  No workspaces yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Create your first workspace to start
                  organizing projects, tasks, and everything
                  else.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="
                    mt-6
                    rounded-xl
                    bg-gray-950
                    px-5 py-3
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  + Create your first workspace
                </button>
              </div>
            )}

          {/* Workspace Grid */}
          {!loading &&
            !error &&
            workspaces.length > 0 && (
              <div
                className="
                  grid
                  gap-6
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {workspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace._id}
                    workspace={workspace}
                    onEdit={setEditingWorkspace}
                    onChangeCover={
                      setChangingCoverWorkspace
                    }
                    onArchive={
                      setArchivingWorkspace
                    }
                  />
                ))}
              </div>
            )}
        </div>
      </main>


      {/* Create */}
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreated={handleCreated}
        />
      )}

      {/* Edit */}
      {editingWorkspace && (
        <EditWorkspaceModal
          workspace={editingWorkspace}
          onClose={() =>
            setEditingWorkspace(null)
          }
          onUpdated={handleUpdated}
        />
      )}

      {/* Archive */}
      {archivingWorkspace && (
        <ArchiveWorkspaceModal
          workspace={archivingWorkspace}
          onClose={() =>
            setArchivingWorkspace(null)
          }
          onArchived={handleArchived}
        />
      )}

      {/* Cover */}
      {changingCoverWorkspace && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setChangingCoverWorkspace(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-950">
              Change workspace cover
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Cover upload will be connected to your
              existing image-upload API.
            </p>

            <button
              type="button"
              onClick={() =>
                setChangingCoverWorkspace(null)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-gray-950
                px-5 py-3
                text-sm font-medium
                text-white
                hover:bg-gray-800
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}