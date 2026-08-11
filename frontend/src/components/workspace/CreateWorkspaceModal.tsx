"use client";

import { useState } from "react";
import type { Workspace } from "@/types/workspace";
import { createWorkspace } from "@/services/workspaceService";

type CreateWorkspaceModalProps = {
  onClose: () => void;
  onCreated: (workspace: Workspace) => void;
};

export default function CreateWorkspaceModal({
  onClose,
  onCreated,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const workspace = await createWorkspace({
        name: name.trim(),
        description: description.trim(),
        coverImage: coverImage.trim() || undefined,
      });

      onCreated(workspace);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create workspace."
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
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-950">
            Create workspace
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new place for your work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="create-workspace-name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Workspace name
            </label>

            <input
              id="create-workspace-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={50}
              placeholder="e.g. Freelancing"
              className="
                w-full rounded-xl
                border border-gray-200
                px-4 py-3
                text-black text-sm
                outline-none
                focus:border-gray-900
                focus:ring-2
                focus:ring-gray-900/10
              "
            />
          </div>

          <div>
            <label
              htmlFor="create-workspace-description"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Description
            </label>

            <textarea
              id="create-workspace-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={300}
              rows={4}
              placeholder="What is this workspace for?"
              className="
                w-full resize-none rounded-xl
                border border-gray-200
                px-4 py-3
                text-black text-sm
                outline-none
                focus:border-gray-900
                focus:ring-2
                focus:ring-gray-900/10
              "
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {description.length}/300
            </p>
          </div>

          <div>
            <label
              htmlFor="create-workspace-cover"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Cover image URL
            </label>

            <input
              id="create-workspace-cover"
              value={coverImage}
              onChange={(event) =>
                setCoverImage(event.target.value)
              }
              placeholder="https://..."
              className="
                w-full rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                outline-none
                focus:border-gray-900
                focus:ring-2
                focus:ring-gray-900/10
              "
            />

            <p className="mt-1 text-xs text-gray-400">
              File upload will be connected to your existing
              upload API next.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
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
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-gray-950
                px-5 py-3
                text-sm font-medium
                text-white
                hover:bg-gray-800
                disabled:opacity-50
              "
            >
              {loading ? "Creating..." : "Create workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}