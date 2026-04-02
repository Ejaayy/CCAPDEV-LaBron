import { apiJson } from "@/lib/api";

export function getStudents() {
  return apiJson("/users/students");
}

export function getUserById(userId) {
  return apiJson(`/users/${userId}`);
}
