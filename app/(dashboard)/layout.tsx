import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import styles from "./layout.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className={styles.container}>
            <CommandPalette />
            <Sidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
