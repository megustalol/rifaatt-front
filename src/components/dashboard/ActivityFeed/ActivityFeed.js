'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Smartphone,
    Ticket,
    CreditCard,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import styles from './ActivityFeed.module.css';
import clsx from 'clsx';

const activityTypes = {
    group_activated: { icon: Users, color: 'success', label: 'Grupo Ativado' },
    instance_disconnected: { icon: Smartphone, color: 'error', label: 'Instância Off' },
    new_reservation: { icon: Ticket, color: 'info', label: 'Nova Reserva' },
    payment_confirmed: { icon: CreditCard, color: 'success', label: 'Pagamento' },
    system_alert: { icon: AlertCircle, color: 'warning', label: 'Alerta' },
};

const ActivityFeed = ({ activities = [] }) => {
    if (activities.length === 0) {
        return (
            <div className={styles.emptyState}>
                <CheckCircle2 size={48} className={styles.emptyIcon} />
                <h4>Sem atividades recentes</h4>
                <p>Bons negócios estão por vir!</p>
            </div>
        );
    }

    return (
        <div className={styles.feed}>
            {activities.map((activity, index) => {
                const type = activityTypes[activity.type] || activityTypes.system_alert;
                const Icon = type.icon;

                return (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.item}
                    >
                        <div className={clsx(styles.iconWrapper, styles[type.color])}>
                            <Icon size={18} />
                        </div>

                        <div className={styles.content}>
                            <p className={styles.description}>{activity.message}</p>
                            <span className={styles.timestamp}>{activity.time}</span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ActivityFeed;
