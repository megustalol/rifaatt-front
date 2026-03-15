'use client';

import React from 'react';
import styles from './DezenasGrid.module.css';
import clsx from 'clsx';
import Tooltip from '@/components/ui/Tooltip/Tooltip';

import { getAnimalForNumber } from '@/utils/animalDictionary';

const DezenasGrid = ({ dezenas = [], totalNumbers = 100 }) => {
    // dezenas: [{ number: '00', status: 'pago' | 'reservado' | 'livre', user: 'Nome' }]

    // Ensure we have N numbers if not provided
    const fullDezenas = Array.from({ length: totalNumbers }, (_, i) => {
        const num = ((i + 1) % totalNumbers).toString().padStart(2, '0');
        const existing = dezenas.find(d => d.number === num);
        return existing || { number: num, status: 'livre', user: null };
    });

    // Sort to follow 01 to 00 order
    const sortedDezenas = [...fullDezenas].sort((a, b) => {
        const valA = parseInt(a.number);
        const valB = parseInt(b.number);
        const nA = valA === 0 ? 1000 : valA;
        const nB = valB === 0 ? 1000 : valB;
        return nA - nB;
    });

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {sortedDezenas.map((dezena) => {
                    const animal = getAnimalForNumber(dezena.number);
                    return (
                        <div
                            key={dezena.number}
                            className={clsx(styles.cell, styles[dezena.status])}
                            title={dezena.user ? `${animal.name} (${dezena.number}) - Reservado por: ${dezena.user}` : `${animal.name} (${dezena.number}) - Livre`}
                        >
                            <span className={styles.animal}>{animal.emoji}</span>
                            <span className={styles.number}>{dezena.number}</span>
                            {dezena.status !== 'livre' && (
                                <div className={styles.statusBadge}>
                                    {dezena.status === 'pago' ? '✅' : '⏳'}
                                </div>
                            )}
                        </div>
                    );
                })}
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
