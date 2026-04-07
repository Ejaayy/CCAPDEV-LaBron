import { apiJson } from "@/lib/api";

export function getLabs() {
  return apiJson("/labs");
}

export function createLab(payload) {
  return apiJson("/labs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateLab(id, payload) {
  return apiJson(`/labs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteLab(id) {
  return apiJson(`/labs/${id}`, {
    method: "DELETE",
  });
}
