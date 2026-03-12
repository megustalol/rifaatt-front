'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, QrCode, Settings, Zap, Send } from 'lucide-react';
import styles from './StepVisuals.module.css';

export const QRScanVisual = () => (
    <div className={styles.visualContainer}>
        <div className={styles.phoneFrame}>
            <div className={styles.phoneScreen}>
                <div className={styles.qrCodeWrapper}>
                    <QrCode size={80} className={styles.qrIcon} strokeWidth={1} />
                    <motion.div
                        className={styles.scanLine}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </div>
        <motion.div
            className={styles.floatingIcon}
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            <Smartphone size={32} />
        </motion.div>
    </div>
);

export const ConfigVisual = () => (
    <div className={styles.visualContainer}>
        <div className={styles.dashboardCard}>
            <div className={styles.dashHeader}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
            <div className={styles.dashBody}>
                <div className={styles.dashRow}>
                    <div className={styles.dashLabel}>Título:</div>
                    <div className={styles.dashInput}>Rifa do iPhone...</div>
                </div>
                <div className={styles.dashRow}>
                    <div className={styles.dashLabel}>Valor:</div>
                    <div className={styles.dashSlider}>
                        <motion.div
                            className={styles.sliderKnob}
                            animate={{ left: ['20%', '80%', '20%'] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                    </div>
                </div>
                <div className={styles.dashRow}>
                    <div className={styles.dashLabel}>Status:</div>
                    <motion.div
                        className={styles.dashToggle}
                        animate={{ backgroundColor: ['#1fc98e', '#374151', '#1fc98e'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <motion.div
                            className={styles.toggleKnob}
                            animate={{ x: [20, 0, 20] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
        <Settings className={styles.floatingSettings} size={24} />
    </div>
);

export const AutopilotVisual = () => (
    <div className={styles.visualContainer}>
        <div className={styles.chatContainer}>
            <motion.div
                className={styles.messageLeft}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
                <span>Reservo o 25! 🦢</span>
            </motion.div>
            <motion.div
                className={styles.messageRight}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
                <span>Número 25 reservado com sucesso! ✅</span>
            </motion.div>
            <motion.div
                className={styles.messageRight}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, repeat: Infinity, repeatDelay: 3 }}
            >
                <span>Pague via PIX: R$ 10,00</span>
            </motion.div>
        </div>
        <div className={styles.autopilotBadge}>
            <Zap size={14} /> <span>AUTO</span>
        </div>
    </div>
);
