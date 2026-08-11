"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Workspace } from "@/types/workspace";
import WorkspaceManageMenu from "./WorkspaceManageMenu";

type WorkspaceCardProps = {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onChangeCover: (workspace: Workspace) => void;
  onArchive: (workspace: Workspace) => void;
};

export default function WorkspaceCard({
  workspace,
  onEdit,
  onChangeCover,
  onArchive,
}: WorkspaceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const coverImage = workspace.coverImage
    ? workspace.coverImage.startsWith("http")
      ? workspace.coverImage
      : `${process.env.NEXT_PUBLIC_SERVER_URL}${workspace.coverImage}`
    : null;

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border border-black/10
        bg-white
        shadow-sm

        transition-all
        duration-500
        ease-out

        hover:-translate-y-3
        hover:scale-[1.02]
        hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.28)]

        will-change-transform
      "
    >
      {/* Cover */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`${workspace.name} cover`}
            className="
              h-full
              w-full
              object-cover

              transition-all
              duration-700
              ease-out

              group-hover:scale-110
              group-hover:brightness-105
            "
          />
        ) : (
          <div
            className="
              h-full
              w-full
              bg-gradient-to-br
              from-gray-200
              via-gray-300
              to-gray-400

              transition-transform
              duration-700
              ease-out

              group-hover:scale-110
            "
          />
        )}

        {/* Image overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/75
            via-black/15
            to-transparent

            transition-opacity
            duration-500

            group-hover:from-black/65
          "
        />

        {/* Manage */}
        <div
          ref={menuRef}
          className="
            absolute
            right-4
            top-4
            z-30
          "
        >
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setMenuOpen((current) => !current);
            }}
            aria-label={`Manage ${workspace.name}`}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full
              border
              border-white/30
              bg-white/90
              text-xl
              leading-none
              text-gray-900

              shadow-lg
              backdrop-blur-md

              transition-all
              duration-300
              ease-out

              hover:scale-110
              hover:rotate-12
              hover:bg-white

              active:scale-95
            "
          >
            ⋮
          </button>

          {menuOpen && (
            <WorkspaceManageMenu
              workspace={workspace}
              onEdit={(workspace) => {
                setMenuOpen(false);
                onEdit(workspace);
              }}
              onChangeCover={(workspace) => {
                setMenuOpen(false);
                onChangeCover(workspace);
              }}
              onArchive={(workspace) => {
                setMenuOpen(false);
                onArchive(workspace);
              }}
            />
          )}
        </div>

        {/* Workspace name */}
        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
            z-10

            transition-transform
            duration-500
            ease-out

            group-hover:-translate-y-1
          "
        >
          <h2
            className="
              truncate
              text-2xl
              font-semibold
              tracking-tight
              text-white

              drop-shadow-lg
            "
          >
            {workspace.name}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div
        className="
          p-5

          transition-transform
          duration-500
          ease-out

          group-hover:translate-y-[-2px]
        "
      >
        <p className="min-h-12 line-clamp-2 text-sm leading-6 text-gray-500">
          {workspace.description ||
            "No description provided."}
        </p>

        <Link
          href={`/workspaces/${workspace._id}`}
          className="
            mt-5
            flex
            items-center
            justify-between

            rounded-xl
            border
            border-black/10
            px-4
            py-3

            text-sm
            font-medium
            text-gray-900

            transition-all
            duration-300

            hover:border-black
            hover:bg-gray-50
            hover:shadow-sm

            active:scale-[0.98]
          "
        >
          <span>Open workspace</span>

          <span
            className="
              text-lg

              transition-transform
              duration-300
              ease-out

              group-hover:translate-x-1
            "
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}