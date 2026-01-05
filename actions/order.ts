"use server";

import { db } from "@/lib/db";

export async function getOrders() {
    try {
        const orders = await db.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        return orders;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return [];
    }
}
