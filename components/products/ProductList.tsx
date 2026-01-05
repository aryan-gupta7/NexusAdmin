"use client";

import { useState } from "react";
import styles from "./ProductList.module.css";

import { GlassCard } from "@/components/ui/GlassCard";
import { SocialCard } from "@/components/social/SocialCard";
import { Copy, Edit, Trash2, Smartphone } from "lucide-react";
import { deleteProduct } from "@/actions/delete-product";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export function ProductList({ products, role }: { products: any[], role?: string }) {
    const [socialMode, setSocialMode] = useState(false);
    const router = useRouter();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        const res = await deleteProduct(deleteId);
        if (res?.error) {
            alert(res.error);
        } else {
            router.refresh();
        }
        setIsDeleting(false);
        setDeleteId(null);
    };

    const isAdmin = role === "ADMIN";
    const canEdit = role === "ADMIN" || role === "MANAGER";

    return (
        <>
            <ConfirmationModal
                isOpen={!!deleteId}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                variant="danger"
                isLoading={isDeleting}
                confirmText="Delete"
            />
            <div className={styles.controls}>
                <button
                    className={`${styles.toggleBtn} ${socialMode ? styles.active : ''}`}
                    onClick={() => setSocialMode(!socialMode)}
                >
                    <Smartphone size={18} />
                    {socialMode ? "Back to Table" : "Social Mode"}
                </button>
            </div>

            {socialMode ? (
                <div className={styles.socialGrid}>
                    {products.map(p => (
                        <SocialCard key={p.id} productName={p.name} price={Number(p.price)} stock={p.stock} />
                    ))}
                </div>
            ) : (
                <div className={styles.grid}>
                    {products.map((product) => (
                        <GlassCard key={product.id} className={styles.productCard}>
                            <div className={styles.imagePlaceholder}>
                                {(() => {
                                    try {
                                        const images = product.images ? JSON.parse(product.images) : [];
                                        return images.length > 0 ? (
                                            <img src={images[0]} alt={product.name} className={styles.productImage} />
                                        ) : (
                                            <div className={styles.noImage}>No Image</div>
                                        );
                                    } catch (e) {
                                        return <div className={styles.noImage}>Error</div>;
                                    }
                                })()}
                            </div>
                            <div className={styles.info}>
                                <div className={styles.topRow}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                                </div>
                                <p className={styles.description}>{product.description}</p>
                                <div className={styles.meta}>
                                    <span className={styles.stock}>Stock: {product.stock}</span>
                                </div>
                                <div className={styles.actions}>
                                    {canEdit && (
                                        <Link href={`/products/${product.id}/edit`} className={styles.actionBtn}>
                                            <Edit size={16} />
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <button
                                            className={`${styles.actionBtn} ${styles.delete}`}
                                            onClick={() => handleDeleteClick(product.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </>
    );
}
