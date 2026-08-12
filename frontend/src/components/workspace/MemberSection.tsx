import type { WorkspaceMember } from "@/types/workspaceMember";
import MemberRow from "./MemberRow";

type MemberSectionProps = {
  members: WorkspaceMember[];
  currentUserId: string;
  onInviteMember: () => void;
  onChangeMemberRole: (
    memberId: string,
    role: "member" | "viewer"
  ) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
};

export default function MemberSection({
  members,
  currentUserId,
  onInviteMember,
  onChangeMemberRole,
  onRemoveMember,
}: MemberSectionProps) {
  return (
    <section className="border-t border-gray-200 px-8 py-10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
            Members
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the people who have access to this workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onInviteMember}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          <span className="text-lg leading-none">+</span>
          Invite Member
        </button>
      </div>

      {members.length > 0 ? (
        <div className="mt-7 overflow-visible rounded-2xl border border-gray-200 bg-white">
          {members.map((member, index) => (
            <div
              key={member._id}
              className={
                index !== members.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }
            >
              <MemberRow
                member={member}
                isCurrentUser={member.user._id === currentUserId}
                onChangeRole={onChangeMemberRole}
                onRemove={onRemoveMember}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            No members found.
          </p>
        </div>
      )}
    </section>
  );
}