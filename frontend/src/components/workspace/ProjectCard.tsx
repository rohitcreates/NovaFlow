import type { Project } from "@/types/project";

type ProjectCardProps = {
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
      return "bg-blue-50 text-blue-700";
    case "completed":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={`${project.name} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <button
          type="button"
          aria-label={`${project.name} options`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-gray-600 shadow-sm transition hover:bg-white hover:text-gray-950"
        >
          <span className="text-lg leading-none">•••</span>
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-950">
          {project.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
          {project.description || "No description provided."}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
              project.status
            )}`}
          >
            {getStatusLabel(project.status)}
          </span>

          {/* Temporary until tasks are wired */}
          <span className="text-sm text-gray-500">Tasks</span>
        </div>
      </div>
    </article>
  );
}