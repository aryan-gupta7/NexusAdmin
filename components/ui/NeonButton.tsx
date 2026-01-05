import styles from './NeonButton.module.css';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export const NeonButton = ({
    children,
    className,
    variant = 'primary',
    isLoading,
    ...props
}: NeonButtonProps) => {
    return (
        <button
            className={clsx(styles.button, styles[variant], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            <span className={styles.content}>
                {isLoading && <Loader2 className={styles.spinner} size={18} />}
                {children}
            </span>
            <div className={styles.glow} />
        </button>
    );
};
