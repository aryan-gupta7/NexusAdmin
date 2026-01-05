"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmationModal.module.css";
import { AlertTriangle, X } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning",
    isLoading = false
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onCancel}>
                    <X size={20} />
                </button>

                <div className={`${styles.iconWrapper} ${styles[variant]}`}>
                    <AlertTriangle size={32} />
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>

                <div className={styles.actions}>
                    <NeonButton variant="secondary" onClick={onCancel} disabled={isLoading}>
                        {cancelText}
                    </NeonButton>
                    <NeonButton
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className={variant === "danger" ? styles.dangerBtn : ""}
                    >
                        {confirmText}
                    </NeonButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
