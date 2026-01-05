"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import styles from "./AnalyticsCharts.module.css";

interface AnalyticsChartsProps {
    categoryData: { name: string; value: number }[];
    topProducts: { name: string; sales: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsCharts({ categoryData, topProducts }: AnalyticsChartsProps) {
    return (
        <div className={styles.grid}>
            <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Sales by Category</h3>
                <div style={{ height: 300, width: "100%" }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={2}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Top 5 Best Sellers</h3>
                <div style={{ height: 300, width: "100%" }}>
                    <ResponsiveContainer>
                        <BarChart data={topProducts}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                            />
                            <Bar dataKey="sales" fill="url(#colorTotal)" radius={[4, 4, 0, 0]} />
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
