import { apiJson } from "@/lib/api";

export function getSlotsByDate(date, options = {}) {
  const params = new URLSearchParams({ date });

  if (options.all) {
    params.set("all", "true");
  }

  return apiJson(`/slots?${params.toString()}`);
}

export function getWeeklyOverview() {
  return apiJson("/slots/overview");
}

export function getSlotOccupancy(slotId, options = {}) {
  const params = new URLSearchParams();

  if (options.details) {
    params.set("details", "true");
  }

  const query = params.toString();
  return apiJson(`/slots/${slotId}/occupancy${query ? `?${query}` : ""}`);
}

export function createSlot(payload) {
  return apiJson("/slots", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSlot(slotId, payload) {
  return apiJson(`/slots/${slotId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
