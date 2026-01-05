import { getCustomers } from "@/actions/customer";
import { GlassCard } from "@/components/ui/GlassCard";
import styles from "./customers.module.css";
import { User, Mail, DollarSign, ShoppingCart } from "lucide-react";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Customers</h1>
                <span className={styles.count}>{customers.length} Total</span>
            </div>

            <div className={styles.grid}>
                {customers.map((customer) => (
                    <GlassCard key={customer.email} className={styles.card}>
                        <div className={styles.avatar}>
                            <User size={28} />
                        </div>
                        <div className={styles.info}>
                            <h3 className={styles.name}>{customer.name}</h3>
                            <p className={styles.email}><Mail size={14} /> {customer.email}</p>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <DollarSign size={18} className={styles.statIcon} />
                                <span className={styles.statValue}>${customer.ltv.toFixed(2)}</span>
                                <span className={styles.statLabel}>Lifetime Value</span>
                            </div>
                            <div className={styles.stat}>
                                <ShoppingCart size={18} className={styles.statIcon} />
                                <span className={styles.statValue}>{customer.orders}</span>
                                <span className={styles.statLabel}>Orders</span>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
