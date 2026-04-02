import { useEffect, useState } from "react";
import { getMe } from "@/lib/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const data = await getMe();
        if (active) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setUser(null);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  return { user, loading, error, setUser };
}
