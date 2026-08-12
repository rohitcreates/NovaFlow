import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

type ProjectUpdateData = {
  name: string;
  description: string;
  status: "planning" | "in-progress" | "completed";
};

type ProjectSectionProps = {
  projects: Project[];
  onCreateProject: () => void;
  onUpdateProject: (
    projectId: string,
    data: ProjectUpdateData
  ) => Promise<void>;
  onArchiveProject: (
    projectId: string
  ) => Promise<void>;
};

export default function ProjectSection({
  projects,
  onCreateProject,
  onUpdateProject,
  onArchiveProject,
}: ProjectSectionProps) {
  return (
    <section className="px-8 py-10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
            Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the projects inside this workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          <span className="text-lg leading-none">+</span>
          Create Project
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onUpdate={onUpdateProject}
              onArchive={onArchiveProject}
            />
          ))}
        </div>
      ) : (
        <div className="mt-7 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <span className="text-2xl text-gray-500">
              +
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No projects yet
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create your first project to get started.
          </p>
        </div>
      )}
    </section>
  );
}