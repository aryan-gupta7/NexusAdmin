import { getOrders } from "@/actions/order";
import { GlassCard } from "@/components/ui/GlassCard";
import styles from "./orders.module.css";
import { Package, Truck, CheckCircle2, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";

export default async function OrdersPage() {
    const orders = await getOrders();

    const getStatusParams = (status: string) => {
        switch (status) {
            case "DELIVERED": return { icon: CheckCircle2, class: styles.delivered };
            case "PROCESSING": return { icon: Truck, class: styles.processing };
            case "PENDING": return { icon: Clock, class: styles.pending };
            default: return { icon: Package, class: styles.default };
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Orders</h1>
                    <span className={styles.count}>{orders.length} Active Orders</span>
                </div>
                <Link href="/orders/new">
                    <NeonButton>
                        <Plus size={18} />
                        New Order
                    </NeonButton>
                </Link>
            </div>

            <GlassCard className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => {
                            const Status = getStatusParams(order.status);
                            return (
                                <tr key={order.id} className={styles.row}>
                                    <td className={styles.id}>
                                        <Link href={`/orders/${order.id}`} className={styles.idLink}>
                                            #{order.id.slice(-6)}
                                        </Link>
                                    </td>
                                    <td>
                                        <div className={styles.customer}>
                                            <span className={styles.name}>{order.customer}</span>
                                            <span className={styles.email}>{order.email}</span>
                                        </div>
                                    </td>
                                    <td className={styles.date}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className={`${styles.status} ${Status.class}`}>
                                            <Status.icon size={14} />
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className={styles.total}>${Number(order.total).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
