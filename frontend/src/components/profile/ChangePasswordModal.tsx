"use client";

import { useState } from "react";

import { changePassword } from "@/services/authService";

type ChangePasswordModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function ChangePasswordModal({
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      onSuccess();
    } catch (error) {
      console.error(
        "Failed to change password:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your account password.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Current password */}
          <div>
            <label
              htmlFor="current-password"
              className="text-sm font-medium text-gray-900"
            >
              Current password
            </label>

            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              disabled={loading}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              placeholder="Enter current password"
            />
          </div>

          {/* New password */}
          <div className="mt-5">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-900"
            >
              New password
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              disabled={loading}
              autoComplete="new-password"
              minLength={8}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              placeholder="Enter new password"
            />

            <p className="mt-2 text-xs text-gray-400">
              Must be at least 8 characters.
            </p>
          </div>

          {/* Confirm password */}
          <div className="mt-5">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-900"
            >
              Confirm new password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              disabled={loading}
              autoComplete="new-password"
              minLength={8}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              placeholder="Confirm new password"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Changing..."
              : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}