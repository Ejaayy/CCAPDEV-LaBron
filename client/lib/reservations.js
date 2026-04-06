import { apiJson } from "@/lib/api";

export function createReservation(payload) {
  return apiJson("/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyReservations() {
  return apiJson("/reservations/my-reservations");
}

export function getMyStats() {
  return apiJson("/reservations/my-stats");
}

export function getAvailabilityStats() {
  return apiJson("/reservations/available-stats");
}

export function getPublicReservationsByUser(userId) {
  return apiJson(`/reservations/user/${userId}`);
}

export function deleteReservation(reservationId) {
  return apiJson(`/reservations/${reservationId}`, {
    method: "DELETE",
  });
}

export function cancelNoShowReservation(reservationId) {
  return apiJson(`/reservations/${reservationId}/no-show`, {
    method: "DELETE",
  });
}

export function updateReservationSeats(reservationId, seats) {
  return apiJson(`/reservations/${reservationId}/seats`, {
    method: "PATCH",
    body: JSON.stringify({ seats }),
  });
}

export function updateReservationStatus(reservationId, status) {
  return apiJson(`/reservations/${reservationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
