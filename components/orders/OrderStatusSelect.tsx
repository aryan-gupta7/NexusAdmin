"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/update-order-status";
import { NeonButton } from "@/components/ui/NeonButton";
import { Check, Loader2 } from "lucide-react";
import styles from "./OrderStatusSelect.module.css";

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleUpdate = async (newStatus: string) => {
        setIsLoading(true);
        const res = await updateOrderStatus(orderId, newStatus);

        if (res.error) {
            alert(res.error);
        } else {
            setStatus(newStatus);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <select
                className={styles.select}
                value={status}
                onChange={(e) => handleUpdate(e.target.value)}
                disabled={isLoading}
            >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
            </select>
            <div className={styles.indicator}>
                {isLoading && <Loader2 className={styles.spin} size={16} />}
                {isSuccess && <Check className={styles.success} size={16} />}
            </div>
        </div>
    );
}
