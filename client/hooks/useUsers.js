import { useEffect, useState } from "react";
import { getStudents, getUserById } from "@/lib/users";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      try {
        const data = await getStudents();
        if (active) {
          setStudents(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setStudents([]);
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      active = false;
    };
  }, []);

  return { students, loading, error };
}

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        const data = await getUserById(userId);
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
  }, [userId]);

  return { user, loading, error };
}
