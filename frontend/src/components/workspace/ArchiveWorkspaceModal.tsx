"use client";

import { useState } from "react";
import type { Workspace } from "@/types/workspace";
import { archiveWorkspace } from "@/services/workspaceService";

type ArchiveWorkspaceModalProps = {
  workspace: Workspace;
  onClose: () => void;
  onArchived: (workspace: Workspace) => void;
};

export default function ArchiveWorkspaceModal({
  workspace,
  onClose,
  onArchived,
}: ArchiveWorkspaceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleArchive = async () => {
    try {
      setLoading(true);
      setError("");

      const archivedWorkspace = await archiveWorkspace(
        workspace._id
      );

      onArchived(archivedWorkspace);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to archive workspace."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-gray-950">
          Archive workspace?
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Are you sure you want to archive{" "}
          <span className="font-medium text-gray-900">
            "{workspace.name}"
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-gray-500">
          The workspace will no longer appear in your active
          workspaces.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              px-4 py-3
              text-sm font-medium
              text-gray-600
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleArchive}
            disabled={loading}
            className="
              rounded-xl
              bg-red-600
              px-5 py-3
              text-sm font-medium
              text-white
              transition
              hover:bg-red-700
              disabled:opacity-50
            "
          >
            {loading ? "Archiving..." : "Archive"}
          </button>
        </div>
      </div>
    </div>
  );
}