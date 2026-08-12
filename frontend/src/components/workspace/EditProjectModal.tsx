"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types/project";

type EditProjectModalProps = {
  project: Project;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    status: "planning" | "in-progress" | "completed";
    coverImage?: File;
  }) => Promise<void>;
};

export default function EditProjectModal({
  project,
  onClose,
  onSubmit,
}: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(
    project.description ?? ""
  );
  const [status, setStatus] = useState<
    "planning" | "in-progress" | "completed"
  >(project.status);

  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | null>(
    project.coverImage ?? null
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coverImage) {
      setPreview(project.coverImage ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(coverImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImage, project.coverImage]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status,
        coverImage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              Edit Project
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your project details and cover.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Project Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
                placeholder="Project name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                disabled={loading}
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
                placeholder="Project description"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "planning"
                      | "in-progress"
                      | "completed"
                  )
                }
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-950"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Cover Image
              </label>

              <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                {preview ? (
                  <img
                    src={
                      preview.startsWith("blob:")
                        ? preview
                        : `${process.env.NEXT_PUBLIC_SERVER_URL}${preview}`
                    }
                    alt="Project cover preview"
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                    No cover image
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={loading}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    setCoverImage(file);
                  }
                }}
                className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />

              <p className="mt-2 text-xs text-gray-400">
                PNG, JPG, WEBP or GIF.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}