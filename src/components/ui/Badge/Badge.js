'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    icon: Icon,
    className
}) => {
    return (
        <div className={clsx(
            styles.badge,
            styles[variant],
            styles[size],
            className
        )}>
            {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
            <span>{children}</span>
        </div>
    );
};

export default Badge;
