"use client";

import { useState } from "react";

type CreateProjectModalProps = {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    coverImage?: File;
  }) => Promise<void>;
};

export default function CreateProjectModal({
  onClose,
  onSubmit,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  if (!trimmedName) {
    return;
  }

  if (trimmedDescription.length < 10) {
    return;
  }

  try {
    setLoading(true);

    console.log("MODAL DATA:", {
  name: trimmedName,
  description: trimmedDescription,
  coverImage,
});

    await onSubmit({
      name: trimmedName,
      description: trimmedDescription,
      coverImage: coverImage ?? undefined,
    });
  } catch (error) {
    console.error("Failed to create project:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              Create Project
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new project inside this workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl leading-none text-gray-400 transition hover:text-gray-700 disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700"
            >
              Project name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Website Redesign"
              autoFocus
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this project about?"
              rows={4}
              minLength={10}
              disabled={loading}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          {description.length > 0 && description.trim().length < 10 && (
    <p className="mt-2 text-xs text-red-500">
      Description must be at least 10 characters.
    </p>
          )}

          <div>
            <label
                htmlFor="project-cover"
                className="block text-sm font-medium text-gray-700"
            >
                Cover image
            </label>

            <input
                id="project-cover"
                type="file"
                accept="image/*"
                onChange={(event) => {
                setCoverImage(event.target.files?.[0] ?? null);
                }}
                disabled={loading}
                className="mt-2 block w-full text-sm text-gray-500"
            />

            {coverImage && (
                <p className="mt-2 text-xs text-gray-500">
                {coverImage.name}
                </p>
            )}
            </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !name.trim() ||
                description.trim().length < 10
                }
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}