'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

const Card = ({
    children,
    variant = 'default',
    className,
    ...props
}) => {
    return (
        <div
            className={clsx(
                styles.card,
                styles[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
