import { getDeepInsights } from "@/actions/analytics";
import { GlassCard } from "@/components/ui/GlassCard";
import styles from "./analytics.module.css";
import { DollarSign, TrendingUp, ShoppingCart, RefreshCcw } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";

export default async function AnalyticsPage() {
    const insights = await getDeepInsights();

    if (!insights) return <div>Failed to load insights.</div>;

    const cards = [
        { label: "Total Revenue", value: `$${insights.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "#10b981" },
        { label: "Avg. Order Value", value: `$${insights.aov.toFixed(2)}`, icon: TrendingUp, color: "#3b82f6" },
        { label: "Conversion Rate", value: `${insights.conversionRate}%`, icon: ShoppingCart, color: "#f59e0b" },
        { label: "Refund Rate", value: `${insights.refundRate}%`, icon: RefreshCcw, color: "#ef4444" },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Analytics & Insights</h1>
                <span className={styles.subtitle}>Real-time performance metrics</span>
            </div>

            <div className={styles.grid}>
                {cards.map((card) => (
                    <GlassCard key={card.label} className={styles.card}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                            <card.icon size={24} />
                        </div>
                        <div className={styles.info}>
                            <span className={styles.label}>{card.label}</span>
                            <span className={styles.value}>{card.value}</span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <AnalyticsCharts
                categoryData={insights.categoryData}
                topProducts={insights.topProducts}
            />
        </div>
    );
}
