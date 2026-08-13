"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type { User } from "@/types/user";

import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/profileService";

import { getMediaUrl } from "@/lib/media";

type EditProfileModalProps = {
  user: User;
  onClose: () => void;
  onSuccess: (user: User) => void;
};

export default function EditProfileModal({
  user,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user.name);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const initials = (name || "User")
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PNG, JPEG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Avatar image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Update name
      await updateMyProfile({
        name: trimmedName,
      });

      // 2. Upload avatar if one was selected
      if (selectedFile) {
        await uploadMyAvatar(selectedFile);
      }

      // 3. Fetch the final user from the backend
      // This guarantees name + avatar are both current.
      const updatedUser = await getMyProfile();

      // 4. Give the complete user to ProfilePage
      onSuccess(updatedUser);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar =
    previewUrl ||
    (user.avatar
      ? getMediaUrl(user.avatar)
      : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your profile information.
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
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-2xl font-semibold text-gray-500">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={`${user.name} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Change Photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div className="mt-7">
            <label
              htmlFor="profile-name"
              className="text-sm font-medium text-gray-900"
            >
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="mt-5">
            <label
              htmlFor="profile-email"
              className="text-sm font-medium text-gray-900"
            >
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            />

            <p className="mt-2 text-xs text-gray-400">
              Email address cannot be changed here.
            </p>
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}