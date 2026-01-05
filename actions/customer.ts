"use server";

import { db } from "@/lib/db";

export async function getCustomers() {
    try {
        // Aggregate users from orders as we don't have a dedicated Customer model
        const orders = await db.order.findMany({
            select: {
                customer: true,
                email: true,
                total: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group by email
        const customerMap = new Map<string, { name: string; email: string; orders: number; ltv: number; lastOrder: Date; }>();

        for (const order of orders) {
            const existing = customerMap.get(order.email);
            if (existing) {
                existing.orders += 1;
                existing.ltv += Number(order.total);
                if (order.createdAt > existing.lastOrder) {
                    existing.lastOrder = order.createdAt;
                }
            } else {
                customerMap.set(order.email, {
                    name: order.customer,
                    email: order.email,
                    orders: 1,
                    ltv: Number(order.total),
                    lastOrder: order.createdAt,
                });
            }
        }

        return Array.from(customerMap.values()).sort((a, b) => b.ltv - a.ltv);
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return [];
    }
}
