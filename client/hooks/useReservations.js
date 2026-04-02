import { useEffect, useState } from "react";
import {
  getMyReservations,
  getMyStats,
  getAvailabilityStats,
} from "@/lib/reservations";

export function useMyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadReservations() {
      try {
        const data = await getMyReservations();
        if (active) {
          setReservations(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setReservations([]);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReservations();

    return () => {
      active = false;
    };
  }, []);

  return { reservations, loading, error, setReservations };
}

export function useMyStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const data = await getMyStats();
        if (active) {
          setStats(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setStats([]);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return { stats, loading, error };
}

export function useAvailabilityStats() {
  const [availability, setAvailability] = useState({
    roomsAvailable: 0,
    slotsAvailable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      try {
        const data = await getAvailabilityStats();
        if (active) {
          setAvailability({
            roomsAvailable: data?.roomsAvailable || 0,
            slotsAvailable: data?.slotsAvailable || 0,
          });
          setError(null);
        }
      } catch (err) {
        if (active) {
          setAvailability({
            roomsAvailable: 0,
            slotsAvailable: 0,
          });
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      active = false;
    };
  }, []);

  return { availability, loading, error };
}
