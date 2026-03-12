'use client';

import React from 'react';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import Card from '@/components/ui/Card/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatsCard.module.css';
import clsx from 'clsx';

const StatsCard = ({
    label,
    value,
    prefix = '',
    suffix = '',
    variation,
    icon: Icon,
    trend = 'up'
}) => {
    const { count, elementRef } = useCounterAnimation(value);

    return (
        <Card className={styles.card} ref={elementRef}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Icon size={24} />
                </div>
                {variation && (
                    <div className={clsx(styles.variation, styles[trend])}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{variation}%</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <h3 className={styles.value}>
                    {prefix}{count.toLocaleString('pt-BR')}{suffix}
                </h3>
            </div>
        </Card>
    );
};

export default StatsCard;
