"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createProduct(formData: FormData) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN" && role !== "MANAGER") {
        return { error: "Unauthorized" };
    }
    // TODO: Add Zod validation here
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const images = formData.get("images") as string || "[]";

    if (!name || !price) {
        return { error: "Missing required fields" };
    }

    try {
        await db.product.create({
            data: {
                name,
                price,
                stock,
                description,
                images,
            }
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { error: "Failed to create product" };
    }
}

export async function getProducts() {
    try {
        const products = await db.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        return [];
    }
}
