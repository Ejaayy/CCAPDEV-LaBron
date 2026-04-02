import { API_BASE_URL } from "@/constants/api";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  return response;
}

export async function apiJson(path, options = {}) {
  const response = await apiFetch(path, options);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
