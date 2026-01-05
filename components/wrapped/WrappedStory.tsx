"use client";

import styles from "./Wrapped.module.css";
import { useState, useEffect } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { useRouter } from "next/navigation";

export function WrappedStory({ stats }: { stats: any }) {
    const router = useRouter();
    const [slide, setSlide] = useState(0);

    const slides = [
        {
            title: "Your Year in Review",
            content: <h1 className={styles.bigText}>2026</h1>,
            bg: "linear-gradient(45deg, #0f0c29, #302b63, #24243e)"
        },
        {
            title: "Top Category",
            content: (
                <div className={styles.statBox}>
                    <span className={styles.label}>You dominated in</span>
                    <span className={styles.value}>{stats.topSellingCategory}</span>
                </div>
            ),
            bg: "linear-gradient(135deg, #FF0099, #493240)"
        },
        {
            title: "Revenue Generated",
            content: (
                <div className={styles.statBox}>
                    <span className={styles.money}>${stats.totalRevenue.toLocaleString()}</span>
                    <span className={styles.label}>Pure Profit</span>
                </div>
            ),
            bg: "linear-gradient(to bottom, #000000, #0f9b0f)"
        },
        {
            title: "Admin Vibe",
            content: (
                <div className={styles.statBox}>
                    <span className={styles.label}>Your Style</span>
                    <span className={styles.value}>{stats.adminStyle}</span>
                </div>
            ),
            bg: "radial-gradient(circle, #b026ff, #000)"
        }
    ];

    const nextSlide = () => {
        if (slide < slides.length - 1) {
            setSlide(s => s + 1);
        } else {
            router.push("/");
        }
    };

    return (
        <div className={styles.container} style={{ background: slides[slide].bg }} onClick={nextSlide}>
            <div className={styles.progressBars}>
                {slides.map((_, i) => (
                    <div key={i} className={`${styles.bar} ${i <= slide ? styles.filled : ''}`} />
                ))}
            </div>

            <div className={styles.content}>
                <h2 className={styles.slideTitle}>{slides[slide].title}</h2>
                {slides[slide].content}
                <p className={styles.hint}>Tap to continue</p>
            </div>
        </div>
    );
}
