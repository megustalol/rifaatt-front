'use client';

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';

const icons = {
    success: <CheckCircle className={styles.icon} size={20} />,
    error: <XCircle className={styles.icon} size={20} />,
    warning: <AlertCircle className={styles.icon} size={20} />,
    info: <Info className={styles.icon} size={20} />,
};

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={clsx(styles.toast, styles[type])}
        >
            <div className={styles.content}>
                {icons[type]}
                <span className={styles.message}>{message}</span>
            </div>

            <button className={styles.closeButton} onClick={onClose}>
                <X size={16} />
            </button>

            <div
                className={styles.progressBar}
                style={{ animationDuration: `${duration}ms` }}
            />
        </motion.div>
    );
};

export default Toast;
