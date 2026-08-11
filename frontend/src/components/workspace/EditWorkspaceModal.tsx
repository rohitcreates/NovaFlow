"use client";

import { useEffect, useState } from "react";
import type { Workspace } from "@/types/workspace";
import {
  updateWorkspace,
  uploadWorkspaceCover,
} from "@/services/workspaceService";

type EditWorkspaceModalProps = {
  workspace: Workspace;
  onClose: () => void;
  onUpdated: (workspace: Workspace) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function EditWorkspaceModal({
  workspace,
  onClose,
  onUpdated,
}: EditWorkspaceModalProps) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(
    workspace.description ?? ""
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(
    null
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(workspace.name);
    setDescription(workspace.description ?? "");
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  }, [workspace]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Only JPG, PNG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Cover image must be smaller than 5 MB.");

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
  };

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

      let updatedWorkspace = await updateWorkspace(
        workspace._id,
        {
          name: name.trim(),
          description: description.trim(),
        }
      );

      if (selectedFile) {
        updatedWorkspace = await uploadWorkspaceCover(
          workspace._id,
          selectedFile
        );
      }

      onUpdated(updatedWorkspace);
      onClose();
    } catch (error) {
      console.error("Error updating workspace:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update workspace."
      );
    } finally {
      setLoading(false);
    }
  };

const currentCover =
  previewUrl ||
  (workspace.coverImage
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${workspace.coverImage}`
    : null);

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
      <div
        className="
          w-full max-w-lg
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
        "
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-950">
            Edit workspace
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your workspace details and cover.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Workspace cover
            </label>

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {currentCover ? (
                <img
                  src={currentCover}
                  alt={`${workspace.name} cover`}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                  No cover image
                </div>
              )}

              <label
                htmlFor="workspace-cover"
                className="
                  absolute bottom-3 right-3
                  cursor-pointer
                  rounded-xl
                  bg-white/95
                  px-4 py-2
                  text-sm font-medium
                  text-gray-900
                  shadow-lg
                  backdrop-blur
                  transition
                  hover:bg-white
                "
              >
                Change cover
              </label>

              <input
                id="workspace-cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              JPG, PNG or WebP. Maximum 5 MB.
            </p>

            {selectedFile && (
              <p className="mt-1 text-xs font-medium text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="workspace-name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Workspace name
            </label>

            <input
              id="workspace-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={50}
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                outline-none
                transition
                focus:border-gray-900
                focus:ring-2
                focus:ring-gray-900/10
              "
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="workspace-description"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Description
            </label>

            <textarea
              id="workspace-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={300}
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                outline-none
                transition
                focus:border-gray-900
                focus:ring-2
                focus:ring-gray-900/10
              "
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {description.length}/300
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
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
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-50
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
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}