"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function deleteProduct(id: string) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN") {
        return { error: "Unauthorized: Only Admins can delete products" };
    }

    try {
        await db.product.delete({
            where: { id: id }
        });
        revalidatePath("/products");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete product" };
    }
}
