import type { User } from "./user";

export type AuthResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
};