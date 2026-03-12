'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import styles from './LogoutOverlay.module.css';

export default function LogoutOverlay() {
    const { loggingOut } = useAuth();

    return (
        <AnimatePresence>
            {loggingOut && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.overlay}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={styles.content}
                    >
                        <div className={styles.logoWrapper}>
                            <Image src="/logomenor.png" alt="Rifaatt" width={100} height={100} priority />
                        </div>
                        <h2 className={styles.title}>Saindo com segurança...</h2>
                        <p className={styles.subtitle}>Até logo!</p>

                        <div className={styles.loader}>
                            <motion.div
                                className={styles.progress}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
