"use client";

import { useState } from "react";
import type { WorkspaceMember } from "@/types/workspaceMember";

type MemberRowProps = {
  member: WorkspaceMember;
  isCurrentUser: boolean;
  onChangeRole: (
    memberId: string,
    role: "member" | "viewer"
  ) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
};

export default function MemberRow({
  member,
  isCurrentUser,
  onChangeRole,
  onRemove,
}: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [loading, setLoading] = useState(false);

  const initials = member.user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChangeRole = async () => {
    try {
      setLoading(true);

      const newRole =
        member.role === "member" ? "viewer" : "member";

      await onChangeRole(member.user._id, newRole);

      setMenuOpen(false);
    } catch (error) {
      console.error("Failed to change member role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);

      await onRemove(member.user._id);

      setConfirmRemove(false);
      setMenuOpen(false);
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex items-center gap-5 px-6 py-5">
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

        {!isCurrentUser && member.role !== "owner" && (
          <div className="relative">
            <button
              type="button"
              aria-label={`${member.user.name} options`}
              disabled={loading}
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            >
              <span className="text-lg leading-none">
                •••
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleChangeRole}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Change to{" "}
                  {member.role === "member"
                    ? "Viewer"
                    : "Member"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmRemove(true);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Remove member
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-950">
              Remove member?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to remove{" "}
              <span className="font-medium text-gray-900">
                {member.user.name}
              </span>{" "}
              from this workspace?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmRemove(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleRemove}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}