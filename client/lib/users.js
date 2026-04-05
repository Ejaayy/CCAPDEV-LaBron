import { apiJson, apiFetch } from "@/lib/api";

export function getStudents() {
  return apiJson("/users/students");
}

export function getUserById(userId) {
  return apiJson(`/users/${userId}`);
}

export function updateProfile(data) {
  return apiJson("/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAccount() {
  const res = await apiFetch("/users/profile", { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete account");
  return res.json();
}