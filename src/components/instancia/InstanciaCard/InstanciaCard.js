'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Badge from '@/components/ui/Badge/Badge';
import { Smartphone, RefreshCw, Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from './InstanciaCard.module.css';
import Button from '@/components/ui/Button/Button';
import clsx from 'clsx';

const statusMap = {
    connected: { label: 'Online', color: 'success', icon: CheckCircle },
    disconnected: { label: 'Offline', color: 'error', icon: XCircle },
    connecting: { label: 'Aguardando QR', color: 'warning', icon: Clock },
};

const InstanciaCard = ({ name, phone, status, onReconnect, onEdit, onDelete }) => {
    const currentStatus = statusMap[status] || statusMap.disconnected;
    const StatusIcon = currentStatus.icon;

    return (
        <Card variant="bordered" className={styles.card}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Smartphone size={24} />
                </div>
                <div className={styles.info}>
                    <h4 className={styles.name}>{name}</h4>
                    <span className={styles.phone}>{phone || 'Número não vinculado'}</span>
                </div>
            </div>

            <div className={styles.statusSection}>
                <Badge variant={currentStatus.color} icon={StatusIcon}>
                    {currentStatus.label}
                </Badge>
                {status === 'connecting' && <div className={styles.pulse} />}
            </div>

            <div className={styles.actions}>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={RefreshCw}
                    onClick={onReconnect}
                    fullWidth
                >
                    Reconectar
                </Button>
                <div className={styles.smallActions}>
                    <button className={styles.actionBtn} onClick={onEdit} title="Editar">
                        <Edit2 size={16} />
                    </button>
                    <button className={clsx(styles.actionBtn, styles.delete)} onClick={onDelete} title="Excluir">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default InstanciaCard;
