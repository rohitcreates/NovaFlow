import type { Project } from "@/types/project";
import { getMediaUrl } from "@/lib/media";

type ProjectHeaderProps = {
  project: Project;
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
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

export default function ProjectHeader({
  project,
}: ProjectHeaderProps) {
  const coverUrl = getMediaUrl(project.coverImage);

  const createdDate = new Date(
    project.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="pb-8">
      {/* Back Navigation */}
      <div className="py-5">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:text-gray-950">
            ←
          </span>

          Back to Workspace
        </button>
      </div>

      {/* Cover */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm">
        {coverUrl ? (
          <div className="relative h-[280px] sm:h-[320px]">
            <img
              src={coverUrl}
              alt={`${project.name} cover`}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.015]"
            />

            {/* Soft bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="flex h-[220px] items-center justify-center bg-gradient-to-br from-gray-100 via-white to-violet-50">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-500 shadow-sm ring-1 ring-gray-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                  />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 15-4.5-4.5L7 20"
                  />
                </svg>
              </div>

              <p className="mt-3 text-sm font-medium text-gray-500">
                No cover image
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="mt-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                {project.name}
              </h1>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  project.status
                )}`}
              >
                {getStatusLabel(project.status)}
              </span>
            </div>

            {project.description && (
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500 sm:text-base">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created
            </span>

            <span className="text-sm font-medium text-gray-700">
              {createdDate}
            </span>
          </div>

          <span className="hidden text-gray-300 sm:inline">
            •
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Project
            </span>

            <span className="text-sm text-gray-500">
              Active workspace project
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}