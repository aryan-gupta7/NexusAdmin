"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { InputGlow } from "@/components/ui/InputGlow";
import { NeonButton } from "@/components/ui/NeonButton";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bgGlow} />
            <GlassCard className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Nexus<span className={styles.highlight}>Admin</span></h1>
                    <p className={styles.subtitle}>Enter the system</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <InputGlow
                        label="Email"
                        type="email"
                        placeholder="admin@nexus.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputGlow
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />

                    {error && <div className={styles.error}>{error}</div>}

                    <NeonButton type="submit" isLoading={loading} className={styles.submitBtn}>
                        Authenticate
                    </NeonButton>
                </form>
            </GlassCard>
        </div>
    );
}
