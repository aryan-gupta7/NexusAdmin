"use server";

import { db } from "@/lib/db";

export async function getProduct(id: string) {
    try {
        const product = await db.product.findUnique({
            where: { id }
        });
        // Convert Decimal to number for Client Components if needed, 
        // but Prisma usually handles this. If serializing issue:
        if (product) {
            return {
                ...product,
                price: Number(product.price)
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}
