'use client';

import React from 'react';
import styles from './Tabs.module.css';
import clsx from 'clsx';

const Tabs = ({ tabs = [], activeTab, onChange, className }) => {
    return (
        <div className={clsx(styles.tabs, className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={clsx(styles.tab, activeTab === tab.id && styles.active)}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.icon && <tab.icon size={18} />}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Tabs;
