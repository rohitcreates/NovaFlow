"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/types/user";

import { useAuth } from "@/context/AuthContext";
import { getMediaUrl } from "@/lib/media";
import { getMyProfile } from "@/services/profileService";

import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const router = useRouter();

  const {
    logout,
    updateUser,
  } = useAuth();

  const [profile, setProfile] =
    useState<User | null>(null);

  const [isEditProfileOpen, setIsEditProfileOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();

        setProfile(data);

        updateUser(data);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [updateUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleProfileSuccess = (
    updatedUser: User
  ) => {
    // Update this page
    setProfile(updatedUser);

    // Update Header / AuthContext / localStorage
    updateUser(updatedUser);

    // Close modal
    setIsEditProfileOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />

              <div>
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-4 w-52 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please log in again to view your profile.
          </p>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  const initials = (profile.name || "User")
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Profile page heading */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information.
          </p>
        </div>

        {/* Profile card */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* User overview */}
          <div className="p-8">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xl font-semibold text-gray-500">
                {profile.avatar ? (
                  <img
                    src={getMediaUrl(profile.avatar) ?? ""}
                    alt={`${profile.name} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-gray-950">
                  {profile.name}
                </h2>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="border-t border-gray-100">
            <div className="px-8 py-5">
              <p className="text-sm font-medium text-gray-900">
                Name
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {profile.name}
              </p>
            </div>

            <div className="border-t border-gray-100 px-8 py-5">
              <p className="text-sm font-medium text-gray-900">
                Email
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between border-t border-gray-100 px-8 py-5">
            <button
              type="button"
              onClick={() =>
                setIsEditProfileOpen(true)
              }
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </section>
      </div>

   
      {isEditProfileOpen && (
        <EditProfileModal
          user={profile}
          onClose={() =>
            setIsEditProfileOpen(false)
          }
          onSuccess={handleProfileSuccess}
        />
      )}
    </main>
  );
}