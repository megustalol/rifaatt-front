'use client';

import React from 'react';
import styles from './DezenasGrid.module.css';
import clsx from 'clsx';
import Tooltip from '@/components/ui/Tooltip/Tooltip';

const DezenasGrid = ({ dezenas = [] }) => {
    // dezenas: [{ number: '00', status: 'pago' | 'reservado' | 'livre', user: 'Nome' }]

    // Ensure we have 100 numbers if not provided
    const fullDezenas = dezenas.length === 100 ? dezenas : Array.from({ length: 100 }, (_, i) => {
        const num = i.toString().padStart(2, '0');
        const existing = dezenas.find(d => d.number === num);
        return existing || { number: num, status: 'livre', user: null };
    });

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {fullDezenas.map((dezena) => (
                    <div
                        key={dezena.number}
                        className={clsx(styles.cell, styles[dezena.status])}
                        title={dezena.user ? `Reservado por: ${dezena.user}` : 'Livre'}
                    >
                        <span className={styles.number}>{dezena.number}</span>
                    </div>
                ))}
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.indicator, styles.livre)} />
                    <span>Livre</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.indicator, styles.reservado)} />
                    <span>Reservado</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.indicator, styles.pago)} />
                    <span>Pago</span>
                </div>
            </div>
        </div>
    );
};

export default DezenasGrid;
