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
    return (
      <div style={{
        minHeight: "100vh",
        background: "#242738",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}>
        <div style={{ position: "relative", width: "48px", height: "48px" }}>
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid rgba(110, 231, 183, 0.15)",
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid transparent",
            borderTopColor: "#6ee7b7",
            animation: "spin 0.8s linear infinite",
          }} />
        </div>
        <p style={{
          color: "#475569",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          Loading...
        </p>
  
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
