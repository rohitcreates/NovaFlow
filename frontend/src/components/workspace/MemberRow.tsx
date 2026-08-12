import type { WorkspaceMember } from "@/types/workspaceMember";

type MemberRowProps = {
  member: WorkspaceMember;
  isCurrentUser: boolean;
};

export default function MemberRow({
  member,
  isCurrentUser,
}: MemberRowProps) {
  const initials = member.user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex items-center gap-5 px-6 py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {member.user.name}
          </p>

          {isCurrentUser && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
              You
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-gray-500">
          {member.user.email}
        </p>
      </div>

      <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600 sm:inline-flex">
        {member.role}
      </span>

      {!isCurrentUser && (
        <button
          type="button"
          aria-label={`${member.user.name} options`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <span className="text-lg leading-none">•••</span>
        </button>
      )}
    </div>
  );
}