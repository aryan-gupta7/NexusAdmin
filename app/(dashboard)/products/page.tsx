import { getProducts } from "@/actions/product";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";
import styles from "./products.module.css";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/products/ProductList";
import { GlassCard } from "@/components/ui/GlassCard";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const rawProducts = await getProducts();
    const products = rawProducts.map(p => ({
        ...p,
        price: Number(p.price)
    }));
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || "STAFF";
    const canManageProducts = role === "ADMIN" || role === "MANAGER";

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Product Inventory</h1>
                    <p className={styles.subtitle}>Manage your digital assets</p>
                </div>
                {canManageProducts && (
                    <Link href="/products/new">
                        <NeonButton>
                            <Plus size={18} />
                            Create Product
                        </NeonButton>
                    </Link>
                )}
            </header>

            {products.length === 0 ? (
                <GlassCard className={styles.empty}>
                    <p>No products found in the void.</p>
                </GlassCard>
            ) : (
                <ProductList products={products} role={role} />
            )}
        </div>
    );
}
