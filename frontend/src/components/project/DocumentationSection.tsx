"use client";

import { useEffect, useState } from "react";

import type { ProjectDocumentation } from "@/types/documentation";

import {
  getProjectDocumentation,
  updateProjectDocumentation,
} from "@/services/projectDocumentationService";

type DocumentationSectionProps = {
  workspaceId: string;
  projectId: string;
};

export default function DocumentationSection({
  workspaceId,
  projectId,
}: DocumentationSectionProps) {
  const [documentation, setDocumentation] =
    useState<ProjectDocumentation | null>(null);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDocumentation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectDocumentation(
          workspaceId,
          projectId
        );

        setDocumentation(data);
        setContent(data.content ?? "");
      } catch (error) {
        console.error(
          "Failed to load project documentation:",
          error
        );

        setError(
          "Unable to load project documentation."
        );
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && projectId) {
      loadDocumentation();
    }
  }, [workspaceId, projectId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const updated =
        await updateProjectDocumentation(
          workspaceId,
          projectId,
          content
        );

      setDocumentation(updated);
      setContent(updated.content ?? "");
      setEditing(false);
    } catch (error) {
      console.error(
        "Failed to save project documentation:",
        error
      );

      setError(
        "Unable to save documentation. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(documentation?.content ?? "");
    setEditing(false);
    setError("");
  };

  const updatedDate = documentation?.updatedAt
    ? new Date(
        documentation.updatedAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Documentation
            </h2>
          </div>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Keep important information, requirements, and
            notes about this project in one place.
          </p>
        </div>

        {!loading && !editing && content.trim() && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
          >
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="space-y-4 p-7">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

              <div className="h-4 w-11/12 animate-pulse rounded bg-gray-100" />

              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />

              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : editing ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Editor Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Edit documentation
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Add notes, requirements, links, or project
                  details.
                </p>
              </div>
            </div>

            {/* Editor */}
            <div className="p-5">
              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Write documentation for this project..."
                className="h-[500px] w-full resize-none overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-4">
              <p className="text-xs text-gray-400">
                Changes are saved to this project.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-gray-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {content.trim() ? (
              <>
                {/* Document */}
                <div className="max-h-[600px] overflow-y-auto px-7 py-8">
                  <div className="max-w-3xl">
                    <p className="whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
                      {content}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                {updatedDate && (
                  <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-7 py-3.5">
                    <p className="text-xs text-gray-400">
                      Last updated {updatedDate}
                    </p>

                    <span className="text-xs text-gray-400">
                      Documentation
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  No documentation yet
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
                  Add project notes, requirements, goals,
                  links, or anything your team needs to
                  remember.
                </p>

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Add Documentation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}