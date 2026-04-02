import { useEffect, useState } from "react";
import { getLabs } from "@/lib/labs";

export default function useLabs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadLabs() {
      try {
        const data = await getLabs();
        if (active) {
          setLabs(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setLabs([]);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLabs();

    return () => {
      active = false;
    };
  }, []);

  return { labs, loading, error, setLabs };
}
