import { apiFetch } from "@/lib/api";
import type {
  AuthResponse,
  RegisterResponse,
} from "@/types/auth";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export async function registerUser(
  data: RegisterData
): Promise<RegisterResponse> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(
  data: LoginData
): Promise<AuthResponse> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  password: string;
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export async function changePassword(
  data: ChangePasswordData
) {
  return apiFetch("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function forgotPassword(
  data: ForgotPasswordData
) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resetPassword(
  token: string,
  data: ResetPasswordData
) {
  return apiFetch(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}