'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon,
    type = 'button',
    onClick,
    className,
    ...props
}) => {
    return (
        <button
            type={type}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                loading && styles.loading,
                className
            )}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className={styles.spinner}></span>
            ) : (
                <>
                    {Icon && <Icon size={size === 'sm' ? 16 : 20} className={styles.icon} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
