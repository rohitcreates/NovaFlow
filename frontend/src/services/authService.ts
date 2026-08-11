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