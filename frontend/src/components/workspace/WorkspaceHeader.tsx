import type { Workspace } from "@/types/workspace";

type WorkspaceHeaderProps = {
  workspace: Workspace;
  memberCount: number;
};

export default function WorkspaceHeader({
  workspace,
  memberCount,
}: WorkspaceHeaderProps) {
  return (
    <section>
      {/* Cover */}
      <div className="relative h-80 overflow-hidden bg-gray-200">
        {workspace.coverImage ? (
          <img
            src={workspace.coverImage}
            alt={`${workspace.name} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Workspace information */}
      <div className="border-b border-gray-200 bg-white px-8 py-7">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          {workspace.name}
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          {workspace.description || "No description provided."}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>

          <span>
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </section>
  );
}