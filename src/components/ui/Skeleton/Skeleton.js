'use client';

import React from 'react';
import styles from './Skeleton.module.css';
import clsx from 'clsx';

const Skeleton = ({
    width,
    height,
    variant = 'text',
    className
}) => {
    return (
        <div
            className={clsx(styles.skeleton, styles[variant], className)}
            style={{ width, height }}
        />
    );
};

export default Skeleton;
