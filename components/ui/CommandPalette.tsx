"use client";

import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Settings, Package, Sparkles, Users, PieChart } from "lucide-react";
import styles from "./CommandPalette.module.css";

const pages = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "New Product", href: "/products/new", icon: Package },
    { name: "Orders", href: "/orders", icon: Settings },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Analytics", href: "/analytics", icon: PieChart },
    { name: "2026 Wrapped", href: "/wrapped", icon: Sparkles },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (href: string) => {
        setOpen(false);
        router.push(href);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen} className={styles.dialog}>
            <CommandInput placeholder="Type a command or search..." className={styles.input} />
            <CommandList className={styles.list}>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation" className={styles.group}>
                    {pages.map((page) => (
                        <CommandItem
                            key={page.href}
                            onSelect={() => handleSelect(page.href)}
                            className={styles.item}
                        >
                            <page.icon size={18} className={styles.icon} />
                            {page.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
