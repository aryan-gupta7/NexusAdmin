"use client";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Sparkles, Users, PieChart } from "lucide-react";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";

const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Orders", href: "/orders", icon: Settings },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Analytics", href: "/analytics", icon: PieChart },
    { name: "2026 Wrapped", href: "/wrapped", icon: Sparkles },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || "STAFF";

    const filteredLinks = links.filter(link => {
        if (link.name === "Analytics" || link.name === "2026 Wrapped") {
            return role === "ADMIN" || role === "MANAGER";
        }
        return true;
    });

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                Nexus<span className={styles.highlight}>Admin</span>
            </div>

            <nav className={styles.nav}>
                {filteredLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(styles.link, isActive && styles.active)}
                        >
                            <Icon size={20} />
                            <span>{link.name}</span>
                            {isActive && <div className={styles.glow} />}
                        </Link>
                    );
                })}
            </nav>

            <button className={styles.logout} onClick={() => signOut()}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
}
