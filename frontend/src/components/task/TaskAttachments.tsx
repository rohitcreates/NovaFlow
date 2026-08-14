"use client";

import { useEffect, useRef, useState } from "react";

import type { TaskAttachment } from "@/types/taskAttachment";
import { getMediaUrl } from "@/lib/media";

import {
  deleteTaskAttachment,
  getTaskAttachments,
  uploadTaskAttachment,
} from "@/services/taskAttachmentService";

type TaskAttachmentsProps = {
  workspaceId: string;
  projectId: string;
  taskId: string;
};

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return "🖼️";
  }

  if (mimeType.includes("pdf")) {
    return "📄";
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("compressed")
  ) {
    return "🗜️";
  }

  return "📎";
}

export default function TaskAttachments({
  workspaceId,
  projectId,
  taskId,
}: TaskAttachmentsProps) {
  const [attachments, setAttachments] = useState<
    TaskAttachment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadAttachments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTaskAttachments(
          workspaceId,
          projectId,
          taskId
        );

        setAttachments(data.attachments ?? data);
      } catch (error) {
        console.error(
          "Failed to load task attachments:",
          error
        );

        setError(
          "Unable to load attachments."
        );
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && projectId && taskId) {
      loadAttachments();
    }
  }, [workspaceId, projectId, taskId]);

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = await uploadTaskAttachment(
        workspaceId,
        projectId,
        taskId,
        file
      );

      const newAttachment =
        data.attachment ?? data;

      setAttachments((current) => [
        newAttachment,
        ...current,
      ]);
    } catch (error) {
      console.error(
        "Failed to upload attachment:",
        error
      );

      setError(
        "Unable to upload the attachment."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (
    attachmentId: string
  ) => {
    try {
      setDeletingId(attachmentId);
      setError("");

      await deleteTaskAttachment(
        workspaceId,
        projectId,
        taskId,
        attachmentId
      );

      setAttachments((current) =>
        current.filter(
          (attachment) =>
            attachment._id !== attachmentId
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete attachment:",
        error
      );

      setError(
        "Unable to delete the attachment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-950">
            Attachments
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Files and resources related to this task.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          className="shrink-0 rounded-xl bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : "+ Add File"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
          </div>
        ) : attachments.length > 0 ? (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment._id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
                  {getFileIcon(
                    attachment.mimeType
                  )}
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {attachment.originalName}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-gray-400">
                    <span>
                      {formatFileSize(
                        attachment.size
                      )}
                    </span>

                    <span>•</span>

                    <span>
                      {new Date(
                        attachment.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <a
                     href={getMediaUrl(attachment.file) ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Open
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        attachment._id
                      )
                    }
                    disabled={
                      deletingId ===
                      attachment._id
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId ===
                    attachment._id
                      ? "..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
              📎
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No attachments
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Upload files that belong to this task.
            </p>

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Add First File
            </button>
          </div>
        )}
      </div>
    </section>
  );
}