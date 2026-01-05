"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateOrderStatus(orderId: string, status: string) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // RBAC: All roles (ADMIN, MANAGER, STAFF) can currently update order status
    // RBAC: All roles (ADMIN, MANAGER, STAFF) can currently update order status
    if (!role || (role !== "ADMIN" && role !== "MANAGER" && role !== "STAFF")) {
        return { error: "Unauthorized" };
    }

    try {
        await db.order.update({
            where: { id: orderId },
            data: { status }
        });

        revalidatePath("/orders");
        revalidatePath(`/orders/${orderId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update order status" };
    }
}
