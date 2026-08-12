"use client";

import { useState } from "react";
import type { Project } from "@/types/project";
import {
  updateProject,
  archiveProject,
} from "@/services/projectService";

type ProjectCardProps = {
  project: Project;
  onUpdate?: (
    projectId: string,
    data: {
      name: string;
      description: string;
      status: "planning" | "in-progress" | "completed";
    }
  ) => Promise<void>;
  onArchive?: (projectId: string) => Promise<void>;
};

function getStatusLabel(status: Project["status"]) {
  switch (status) {
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return "Planning";
  }
}

function getStatusClasses(status: Project["status"]) {
  switch (status) {
    case "in-progress":
      return "bg-blue-50 text-blue-700";
    case "completed":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function ProjectCard({
  project,
  onUpdate,
  onArchive,
}: ProjectCardProps) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(
    project.description ?? ""
  );
  const [status, setStatus] = useState<
    "planning" | "in-progress" | "completed"
  >(project.status);

  const handleEdit = () => {
    setMenuOpen(false);

    setName(project.name);
    setDescription(project.description ?? "");
    setStatus(project.status);

    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: name.trim(),
        description: description.trim(),
        status,
      };

      if (onUpdate) {
        await onUpdate(project._id, data);
      } else {
        await updateProject(
          project.workspace,
          project._id,
          data
        );
      }

      setEditOpen(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    const confirmed = window.confirm(
      `Archive "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMenuOpen(false);

      if (onArchive) {
        await onArchive(project._id);
      } else {
        await archiveProject(
          project.workspace,
          project._id
        );
      }
    } catch (error) {
      console.error("Failed to archive project:", error);
    }
  };

  return (
    <>
      <article className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-200">
          {project.coverImage ? (
            <img
              src={`${SERVER_URL}${project.coverImage}`}
              alt={`${project.name} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute right-4 top-4">
            <button
              type="button"
              aria-label={`${project.name} options`}
              onClick={() =>
                setMenuOpen((current) => !current)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-gray-600 shadow-sm transition hover:bg-white hover:text-gray-950"
            >
              <span className="text-lg leading-none">
                •••
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  Edit Project
                </button>

                <button
                  type="button"
                  onClick={handleArchive}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  Archive Project
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-950">
            {project.name}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
            {project.description ||
              "No description provided."}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                project.status
              )}`}
            >
              {getStatusLabel(project.status)}
            </span>

            <span className="text-sm text-gray-500">
              Tasks
            </span>
          </div>
        </div>
      </article>

      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-950">
              Edit Project
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Project name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  placeholder="Project name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  placeholder="Project description"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "planning"
                        | "in-progress"
                        | "completed"
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                >
                  <option value="planning">
                    Planning
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving || !name.trim()}
                onClick={handleSave}
                className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}