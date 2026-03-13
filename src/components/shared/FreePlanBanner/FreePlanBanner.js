'use client';

import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './FreePlanBanner.module.css';

const FreePlanBanner = () => {
    const router = useRouter();

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Rocket size={18} />
                </div>
                <p className={styles.text}>
                    Você está usando o <strong>Plano Gratuito</strong>. Assine um plano para desbloquear todas as funcionalidades e começar a escalar.
                </p>
            </div>
            <button className={styles.button} onClick={() => router.push('/checkout')}>
                Fazer Upgrade
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

export default FreePlanBanner;
