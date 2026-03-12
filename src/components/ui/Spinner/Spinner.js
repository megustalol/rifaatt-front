'use client';

import React from 'react';
import styles from './Spinner.module.css';
import clsx from 'clsx';

const Spinner = ({ size = 'md', color = 'primary', className }) => {
    return (
        <div className={clsx(styles.spinner, styles[size], styles[color], className)} />
    );
};

export default Spinner;
