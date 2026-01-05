import styles from "./page.module.css";
console.log(styles); // Prevent unused cleanup if strict
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { getDashboardMetrics } from "@/actions/dashboard";
import Link from "next/link";
import { SalesChart } from "@/components/dashboard/SalesChart";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const metrics = await getDashboardMetrics();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nexus<span className={styles.highlight}>Admin</span></h1>
        <p className={styles.subtitle}>Welcome to the void.</p>
      </header>

      <div className={styles.grid}>
        <GlassCard>
          <h2>Sales Today</h2>
          <p className={styles.stat}>${metrics.sales.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <h2>Active Users</h2>
          <p className={styles.stat}>{metrics.users.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <h2>Orders</h2>
          <p className={styles.stat}>{metrics.orders}</p>
        </GlassCard>
        <GlassCard>
          <h2>Products</h2>
          <p className={styles.stat}>{metrics.products}</p>
        </GlassCard>

        <SalesChart />
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link href="/products">
          <NeonButton>Manage Products</NeonButton>
        </Link>
      </div>
    </main>
  );
}
