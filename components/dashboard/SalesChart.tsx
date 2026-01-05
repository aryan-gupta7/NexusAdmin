"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import styles from "./SalesChart.module.css";
import { GlassCard } from "../ui/GlassCard";

const data = [
    { name: "Mon", sales: 12400 },
    { name: "Tue", sales: 15300 },
    { name: "Wed", sales: 9800 },
    { name: "Thu", sales: 18900 },
    { name: "Fri", sales: 23400 },
    { name: "Sat", sales: 19800 },
    { name: "Sun", sales: 25600 },
];

export function SalesChart() {
    return (
        <GlassCard className={styles.chartCard}>
            <h3 className={styles.title}>Weekly Revenue</h3>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#b026ff" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#b026ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#a0a0b0" />
                        <YAxis stroke="#a0a0b0" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(5, 5, 16, 0.9)",
                                borderColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#b026ff"
                            fillOpacity={1}
                            fill="url(#colorSales)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
