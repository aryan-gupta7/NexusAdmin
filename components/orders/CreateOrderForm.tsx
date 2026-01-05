"use client";

import { useState } from "react";
import { createOrder } from "@/actions/create-order";
import { GlassCard } from "@/components/ui/GlassCard";
import { InputGlow } from "@/components/ui/InputGlow";
import { NeonButton } from "@/components/ui/NeonButton";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import styles from "./CreateOrderForm.module.css";

interface Product {
    id: string;
    name: string;
    price: string | number;
}

export function CreateOrderForm({ products }: { products: Product[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await createOrder(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/orders");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <GlassCard className={styles.card}>
            <h2 className={styles.title}>Record New Sale</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <InputGlow name="customer" label="Customer Name" placeholder="e.g. David Martinez" required />
                    <InputGlow name="email" label="Customer Email" placeholder="david@example.com" type="email" required />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Product</label>
                        <select name="productId" className={styles.select} required>
                            <option value="">Select a product...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - ${Number(p.price).toFixed(2)}</option>
                            ))}
                        </select>
                    </div>
                    <InputGlow name="quantity" label="Quantity" type="number" min="1" defaultValue="1" required />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Status</label>
                    <select name="status" className={styles.select}>
                        <option value="DELIVERED">Delivered (Completed Sale)</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>

                {error && (
                    <div className={styles.error}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <NeonButton type="submit" isLoading={loading}>
                    <CheckCircle2 size={18} />
                    Create Order
                </NeonButton>
            </form>
        </GlassCard>
    );
}
