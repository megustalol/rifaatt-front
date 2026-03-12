'use client';

import React from 'react';
import styles from './QRCodeDisplay.module.css';
import { QrCode } from 'lucide-react';

const QRCodeDisplay = ({ value, size = 200, loading = false }) => {
    return (
        <div className={styles.container}>
            <div className={styles.qrWrapper} style={{ width: size, height: size }}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                    </div>
                ) : (
                    <QrCode size={size * 0.8} strokeWidth={1.5} color="#000" />
                )}
            </div>
        </div>
    );
};

export default QRCodeDisplay;
