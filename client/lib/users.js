import { apiJson, apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/constants/api";

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

export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePic", file);

  const response = await fetch(`${API_BASE_URL}/users/profile-picture`, {
    method: "POST",
    credentials: "include", // Crucial for session cookies
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.message || "Failed to upload image");
  }

  return await response.json();
}

export async function deleteProfilePicture() {
  return await apiJson("/users/profile-picture", { method: "DELETE" });
}