"use server";

import { db } from "@/lib/db";

export async function getDashboardMetrics() {
    try {
        const productsCount = await db.product.count();
        const ordersCount = await db.order.count();

        // Mock sales data for now as we don't have order processing flow yet
        const salesTotal = 12404;

        return {
            sales: salesTotal,
            users: 8291, // Mock user count until we have public users
            orders: ordersCount,
            products: productsCount
        };
    } catch (error) {
        return {
            sales: 0,
            users: 0,
            orders: 0,
            products: 0
        };
    }
}
