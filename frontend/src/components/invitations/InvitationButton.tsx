"use client";

import { useEffect, useRef, useState } from "react";
import {
  acceptInvitation,
  declineInvitation,
  getMyInvitations,
} from "@/services/invitationService";
import type { WorkspaceInvitation } from "@/types/workspaceInvitation";

export default function InvitationButton() {
  const [invitations, setInvitations] = useState<
    WorkspaceInvitation[]
  >([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingToken, setProcessingToken] = useState<string | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const loadInvitations = async () => {
    try {
      setLoading(true);

      const data = await getMyInvitations();

      setInvitations(data);
    } catch (error) {
      console.error("Failed to load invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
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

  const handleAccept = async (token: string) => {
    try {
      setProcessingToken(token);

      await acceptInvitation(token);

      setInvitations((current) =>
        current.filter((invitation) => invitation.token !== token)
      );
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    } finally {
      setProcessingToken(null);
    }
  };

  const handleDecline = async (token: string) => {
    try {
      setProcessingToken(token);

      await declineInvitation(token);

      setInvitations((current) =>
        current.filter((invitation) => invitation.token !== token)
      );
    } catch (error) {
      console.error("Failed to decline invitation:", error);
    } finally {
      setProcessingToken(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Invitation button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Invitations"
        className="
          relative
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          text-gray-400
          transition-all duration-200
          hover:bg-white/10
          hover:text-white
        "
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>

        {invitations.length > 0 && (
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
              ring-2
              ring-gray-950
            "
          >
            {invitations.length > 9
              ? "9+"
              : invitations.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-12
            z-[100]
            w-[360px]
            overflow-hidden
            rounded-2xl
            border
            border-black/10
            bg-white
            text-gray-950
            shadow-2xl
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">
                Invitations
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                Workspace invitations
              </p>
            </div>

            {invitations.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {invitations.length}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-xl border border-gray-100 p-4"
                  >
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-48 rounded bg-gray-100" />
                    <div className="mt-4 h-9 rounded-lg bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 13c0 5-3 8-8 8s-8-3-8-8c0-4 3-7 8-7s8 3 8 7Z" />
                    <path d="M8 13h.01M16 13h.01" />
                    <path d="M9 17c1.5 1 4.5 1 6 0" />
                  </svg>
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No pending invitations
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {invitations.map((invitation) => {
                  const processing =
                    processingToken === invitation.token;

                  return (
                    <div
                      key={invitation._id}
                      className="p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                          {invitation.workspace.coverImage ? (
                            <img
                              src={
                                invitation.workspace.coverImage
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-500">
                              {invitation.workspace.name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-semibold">
                            {invitation.workspace.name}
                          </h4>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            <span className="font-medium text-gray-700">
                              {invitation.invitedBy.name}
                            </span>{" "}
                            invited you as{" "}
                            <span className="font-medium capitalize text-gray-700">
                              {invitation.role}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            handleAccept(invitation.token)
                          }
                          className="
                            flex-1
                            rounded-lg
                            bg-gray-950
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-gray-800
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {processing
                            ? "Processing..."
                            : "Accept"}
                        </button>

                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            handleDecline(invitation.token)
                          }
                          className="
                            flex-1
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-gray-600
                            transition
                            hover:bg-gray-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}