"use client";

import type { Workspace } from "@/types/workspace";

type WorkspaceManageMenuProps = {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onChangeCover: (workspace: Workspace) => void;
  onArchive: (workspace: Workspace) => void;
};

export default function WorkspaceManageMenu({
  workspace,
  onEdit,
  onChangeCover,
  onArchive,
}: WorkspaceManageMenuProps) {
  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-52
        overflow-hidden
        rounded-2xl
        border
        border-black/10
        bg-white
        p-1.5
        shadow-xl

        animate-in
        fade-in
        zoom-in-95
        duration-150
      "
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {/* Edit */}
      <button
        type="button"
        onClick={() => onEdit(workspace)}
        className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-3
          py-2.5
          text-left
          text-sm
          font-medium
          text-gray-800
          transition-colors
          hover:bg-gray-100
        "
      >
        <span className="text-base">✎</span>

        <span>Edit workspace</span>
      </button>

      {/* Change cover */}
      <button
        type="button"
        onClick={() => onChangeCover(workspace)}
        className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-3
          py-2.5
          text-left
          text-sm
          font-medium
          text-gray-800
          transition-colors
          hover:bg-gray-100
        "
      >
        <span className="text-base">▧</span>

        <span>Change cover</span>
      </button>

      {/* Divider */}
      <div className="my-1.5 h-px bg-gray-100" />

      {/* Archive */}
      <button
        type="button"
        onClick={() => onArchive(workspace)}
        className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-3
          py-2.5
          text-left
          text-sm
          font-medium
          text-red-600
          transition-colors
          hover:bg-red-50
        "
      >
        <span className="text-base">□</span>

        <span>Archive workspace</span>
      </button>
    </div>
  );
}