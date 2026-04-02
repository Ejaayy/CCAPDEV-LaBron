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
