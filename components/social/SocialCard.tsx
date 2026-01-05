"use client";

import styles from "./SocialCard.module.css";
import { GlassCard } from "@/components/ui/GlassCard";
import { Copy, Share2, Download } from "lucide-react";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

interface SocialCardProps {
    productName: string;
    price: number;
    stock: number;
}

export function SocialCard({ productName, price, stock }: SocialCardProps) {
    const [downloading, setDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true });
            saveAs(dataUrl, `nexus-drop-${productName}.png`);
        } catch (err) {
            console.error(err);
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Nexus Drop: ${productName}`,
            text: `Check out ${productName} for $${price}!`,
            url: window.location.href,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            navigator.clipboard.writeText(`Check out ${productName}!`);
            alert("Link copied to cliboard!");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div ref={cardRef}>
                <GlassCard className={styles.card} hoverEffect={false}>
                    <div className={styles.header}>
                        <span className={styles.brand}>NEXUS<span className={styles.brandHighlight}>DROP</span></span>
                        <span className={styles.newBadge}>NEW ARRIVAL</span>
                    </div>

                    <div className={styles.imagePlaceholder}>
                        <div className={styles.circle1} />
                        <div className={styles.circle2} />
                        <h3 className={styles.productName}>{productName}</h3>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.priceTag}>${price}</div>
                        <div className={styles.stockStatus}>{stock > 0 ? "IN STOCK" : "SOLD OUT"}</div>
                    </div>
                </GlassCard>
            </div>

            <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={handleDownload}>
                    {downloading ? "Saving..." : <><Download size={18} /> Download Story</>}
                </button>
                <button className={styles.actionBtn} onClick={handleShare}>
                    <Share2 size={18} />
                </button>
            </div >
        </div >
    );
}
