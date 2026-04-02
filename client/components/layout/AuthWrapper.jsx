import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return children;
}
