import { apiFetch, apiJson } from "@/lib/api";

export function getMe() {
  return apiJson("/auth/me");
}

export function login(payload) {
  return apiJson("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload) {
  return apiJson("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  const response = await apiFetch("/auth/logout");

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return true;
}

export function forgotPassword(email) {
  return apiJson("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(payload) {
  return apiJson("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
