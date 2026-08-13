import { apiFetch } from "@/lib/api";

export type UpdateProfileData = {
  name: string;
};

export async function getMyProfile() {
  const response = await apiFetch("/auth/me");

  return response.user ?? response;
}

export async function updateMyProfile(
  data: UpdateProfileData
) {
  const response = await apiFetch("/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.user ?? response;
}

export async function uploadMyAvatar(
  file: File
) {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await apiFetch(
    "/auth/me/avatar",
    {
      method: "POST",
      body: formData,
    }
  );

  return response.user ?? response;
}