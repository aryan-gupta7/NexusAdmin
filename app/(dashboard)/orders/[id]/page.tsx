import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui/GlassCard";
import { OrderStatusSelect } from "@/components/orders/OrderStatusSelect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./order-details.module.css";
import { ArrowLeft, User, Mail, Calendar, Package } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!role) {
        redirect("/login");
    }

    const order = await db.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        return (
            <div className={styles.container}>
                <GlassCard className={styles.errorCard}>
                    <h2>Order Not Found</h2>
                    <Link href="/orders" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Orders
                    </Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/orders" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    <span>Back to Orders</span>
                </Link>
                <div className={styles.headerActions}>
                    <div className={styles.orderId}>Order #{order.id.slice(-6)}</div>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
            </header>

            <div className={styles.grid}>
                <GlassCard className={styles.mainCard}>
                    <h2 className={styles.cardTitle}>Order Items</h2>
                    <div className={styles.itemsList}>
                        {order.items.map((item) => (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemIcon}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div className={styles.itemName}>{item.product.name}</div>
                                        <div className={styles.itemMeta}>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className={styles.itemTotal}>
                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                        <div className={styles.totalRow}>
                            <span>Total Amount</span>
                            <span className={styles.finalTotal}>${Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </GlassCard>

                <div className={styles.sideColumn}>
                    <GlassCard className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>Customer Details</h3>
                        <div className={styles.infoRow}>
                            <User size={16} className={styles.icon} />
                            <span>{order.customer}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <Mail size={16} className={styles.icon} />
                            <span>{order.email}</span>
                        </div>
                    </GlassCard>

                    <GlassCard className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>Order Info</h3>
                        <div className={styles.infoRow}>
                            <Calendar size={16} className={styles.icon} />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.statusLabel}>Current Status:</span>
                            <span className={styles[`status${order.status}`]}>{order.status}</span>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
