"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateProduct(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN" && role !== "MANAGER") {
        return { error: "Unauthorized" };
    }
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const images = formData.get("images") as string;

    try {
        await db.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                images: images || "[]",
            }
        });

        revalidatePath("/products");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update product" };
    }
}
