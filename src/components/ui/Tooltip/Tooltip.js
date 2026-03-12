'use client';

import React, { useState } from 'react';
import styles from './Tooltip.module.css';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, text, position = 'top' }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
                        className={clsx(styles.tooltip, styles[position])}
                    >
                        {text}
                        <div className={styles.arrow} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
