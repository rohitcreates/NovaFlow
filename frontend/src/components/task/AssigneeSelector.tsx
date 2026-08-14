"use client";

import { useState } from "react";

import type { Task } from "@/types/task";
import type { WorkspaceMember } from "@/types/workspaceMember";
import type { UpdateTaskData } from "@/services/taskService";

import { getMediaUrl } from "@/lib/media";

type AssigneeSelectorProps = {
  task: Task;
  members: WorkspaceMember[];
  onUpdate: (data: UpdateTaskData) => Promise<void>;
};

export default function AssigneeSelector({
  task,
  members,
  onUpdate,
}: AssigneeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const assignedIds = new Set(
    task.assignees.map((assignee) => assignee._id)
  );

  const filteredMembers = members.filter((member) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      member.user.name.toLowerCase().includes(query) ||
      member.user.email.toLowerCase().includes(query)
    );
  });

  const handleToggle = async (memberId: string) => {
    if (saving) {
      return;
    }

    const isAssigned = assignedIds.has(memberId);

    const nextAssignees = isAssigned
      ? task.assignees
          .filter((assignee) => assignee._id !== memberId)
          .map((assignee) => assignee._id)
      : [
          ...task.assignees.map(
            (assignee) => assignee._id
          ),
          memberId,
        ];

    console.log("CLICKED MEMBER:", memberId);
    console.log("CURRENT ASSIGNEES:", task.assignees);
    console.log("NEXT ASSIGNEES:", nextAssignees);

    try {
      setSaving(true);

      await onUpdate({
        assignees: nextAssignees,
      });

      console.log("ASSIGNEES UPDATED");
    } catch (error) {
      console.error(
        "Failed to update task assignees:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Current assignees */}
      <div className="space-y-3">
        {task.assignees.length > 0 ? (
          task.assignees.map((assignee) => {
            const avatarUrl = getMediaUrl(
              assignee.avatar
            );

            const initials = assignee.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={assignee._id}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={assignee.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {assignee.name}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    {assignee.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleToggle(assignee._id)
                  }
                  disabled={saving}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${assignee.name}`}
                >
                  ×
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400">
            No assignees
          </p>
        )}
      </div>

      {/* Add assignee */}
      <div className="relative mt-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          disabled={saving}
          className="text-sm font-medium text-gray-700 transition hover:text-gray-950 disabled:opacity-50"
        >
          + Add Assignee
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="border-b border-gray-100 p-3">
              <input
                autoFocus
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search members..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const user = member.user;

                  const isAssigned = assignedIds.has(
                    user._id
                  );

                  const avatarUrl = getMediaUrl(
                    user.avatar
                  );

                  const initials = user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() =>
                        handleToggle(user._id)
                      }
                      disabled={saving}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-gray-400">
                          {user.email}
                        </p>
                      </div>

                      {isAssigned && (
                        <span className="text-sm font-semibold text-gray-950">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-5 text-center text-sm text-gray-400">
                  No members found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}