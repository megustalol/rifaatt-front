'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.zebraIcon}>🦓</div>
                <div className={styles.errorCode}>404</div>
                <h2 className={styles.title}>Deu Zebra!</h2>
                <p className={styles.description}>
                    Parece que essa dezena não foi sorteada. <br />
                    A página que você está procurando fugiu com o bicheiro ou nunca existiu no nosso palpite.
                </p>
                <div className={styles.actions}>
                    <Link href="/">
                        <Button variant="primary" size="lg">
                            Voltar para o Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
