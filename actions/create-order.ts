"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder(formData: FormData) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // Ensure user has some role (Staff+)
    if (!role || (role !== "ADMIN" && role !== "MANAGER" && role !== "STAFF")) {
        return { error: "Unauthorized" };
    }
    const customer = formData.get("customer") as string;
    const email = formData.get("email") as string;
    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const status = formData.get("status") as string;

    if (!customer || !email || !productId || !quantity) {
        return { error: "Missing required fields" };
    }

    try {
        const product = await db.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return { error: "Product not found" };
        }

        const total = Number(product.price) * quantity;

        await db.order.create({
            data: {
                customer,
                email,
                total,
                status: status || "PENDING",
                items: {
                    create: [
                        {
                            productId,
                            quantity,
                            price: product.price
                        }
                    ]
                }
            }
        });

        revalidatePath("/orders");
        revalidatePath("/analytics");
        revalidatePath("/customers");

        return { success: true };
    } catch (error) {
        console.error("Create order error:", error);
        return { error: "Failed to create order" };
    }
}
