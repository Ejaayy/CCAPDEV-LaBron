import { useEffect, useState } from "react";
import {
  getSlotsByDate,
  getWeeklyOverview,
  getSlotOccupancy,
} from "@/lib/slots";

export function useSlotsByDate(date, options = {}) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(Boolean(date));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!date) {
      setSlots([]);
      setLoading(false);
      return;
    }

    async function loadSlots() {
      try {
        setLoading(true);
        const data = await getSlotsByDate(date, options);
        if (active) {
          setSlots(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setSlots([]);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [date, options.all]);

  return { slots, loading, error, setSlots };
}

export function useWeeklyOverview() {
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const data = await getWeeklyOverview();
        if (active) {
          setOverview(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setOverview([]);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      active = false;
    };
  }, []);

  return { overview, loading, error };
}

export function useSlotOccupancy(slotId, options = {}) {
  const [occupancy, setOccupancy] = useState(options.details ? null : []);
  const [loading, setLoading] = useState(Boolean(slotId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!slotId) {
      setLoading(false);
      return;
    }

    async function loadOccupancy() {
      try {
        setLoading(true);
        const data = await getSlotOccupancy(slotId, options);
        if (active) {
          setOccupancy(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setOccupancy(options.details ? null : []);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOccupancy();

    return () => {
      active = false;
    };
  }, [slotId, options.details]);

  return { occupancy, loading, error, setOccupancy };
}
