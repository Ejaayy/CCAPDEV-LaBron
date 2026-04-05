import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";
import loginStyles from "./login.module.css";

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            await resetPassword({ token, newPassword });
            setIsSuccess(true);
            setMessage("Password has been successfully updated!");
        } catch (error) {
            setMessage(error.message || "Invalid or expired token.");
        }
    };

    return (
        <div style={{ backgroundColor: "#070B20", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
            <div style={{ backgroundColor: "#141A3A", padding: "40px", borderRadius: "8px", width: "100%", maxWidth: "500px", textAlign: "center" }}>

                <h1 style={{ marginBottom: "10px" }}>Create New Password</h1>

                {isSuccess ? (
                    <div>
                        <p style={{ color: "#4CAF50", marginBottom: "20px" }}>{message}</p>
                        <Link
                            href="/auth/login"
                            className={loginStyles.confirmButton}
                            style={{
                                textDecoration: "none",
                                display: "block",
                                width: "100%",
                                boxSizing: "border-box",
                                marginTop: "20px",
                                paddingTop: "2.5%",
                            }}
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "20px" }}>
                            <label className={loginStyles.formLabels} style={{ color: "white" }}>
                                New Password
                            </label>
                            <input
                                className={loginStyles.inputboxes}
                                style={{ width: "100%", marginTop: "8px" }}
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label className={loginStyles.formLabels} style={{ color: "white" }}>
                                Confirm Password
                            </label>
                            <input
                                className={loginStyles.inputboxes}
                                style={{ width: "100%", marginTop: "8px" }}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {message && <p style={{ color: "#ff6b6b", marginBottom: "20px" }}>{message}</p>}

                        <button type="submit" className={loginStyles.confirmButton} style={{ width: "100%" }}>
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}