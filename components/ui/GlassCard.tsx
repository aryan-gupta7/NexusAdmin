import styles from './GlassCard.module.css';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className, hoverEffect = true }: GlassCardProps) => {
    return (
        <div className={clsx(styles.card, hoverEffect && styles.hover, className)}>
            <div className={styles.glow} />
            <div className={styles.content}>{children}</div>
        </div>
    );
};
