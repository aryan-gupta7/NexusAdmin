import styles from './InputGlow.module.css';
import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputGlowProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const InputGlow = forwardRef<HTMLInputElement, InputGlowProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className={styles.wrapper}>
                {label && <label className={styles.label}>{label}</label>}
                <div className={styles.inputContainer}>
                    <input
                        ref={ref}
                        className={clsx(styles.input, error && styles.inputError, className)}
                        {...props}
                    />
                    <div className={styles.line} />
                </div>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

InputGlow.displayName = "InputGlow";
