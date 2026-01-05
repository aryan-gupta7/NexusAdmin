"use server";

import { db } from "@/lib/db";

export async function getDeepInsights() {
    try {
        const [products, orders] = await Promise.all([
            db.product.findMany({ include: { orderItems: true } }),
            db.order.findMany({ include: { items: true } })
        ]);

        // 1. Calculate AOV
        const totalRevenue = orders.reduce((acc: number, order: any) => acc + Number(order.total), 0);
        const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

        // 2. Category Distribution
        const categoryMap = new Map<string, number>();
        products.forEach((p: any) => {
            if (p.category) {
                categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
            }
        });
        const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

        // 3. Top Selling Products
        const productSales = new Map<string, number>();
        orders.forEach((order: any) => {
            order.items.forEach((item: any) => {
                // Simplification: counting quantity. In real app, match item.productId to name
                // Since we have products fetched, let's map it properly
                const product = products.find((p: any) => p.id === item.productId);
                if (product) {
                    productSales.set(product.name, (productSales.get(product.name) || 0) + item.quantity);
                }
            });
        });

        const topProducts = Array.from(productSales.entries())
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        return {
            aov,
            totalRevenue,
            totalOrders: orders.length,
            categoryData,
            topProducts,
            conversionRate: 3.2, // Mocked for now (sessions vs orders)
            refundRate: 0.5,     // Mocked
        };

    } catch (error) {
        console.error("Deep insights error:", error);
        return null;
    }
}
