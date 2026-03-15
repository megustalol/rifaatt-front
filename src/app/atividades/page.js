'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './page.module.css';
import api from '@/services/api';

export default function AtividadesPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchActivities = async (p) => {
        setLoading(true);
        try {
            const response = await api.get(`/reports/activities?page=${p}&limit=20`);
            setActivities(response.data.activities || []);
            setTotalPages(response.data.totalPages || 1);
            setTotal(response.data.total || 0);
            setPage(response.data.page || 1);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities(1);
    }, []);

    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        fetchActivities(p);
    };

    const getStatusBadge = (status) => {
        const map = {
            PAID: { label: 'Pago', className: styles.badgePaid },
            RESERVED: { label: 'Reservado', className: styles.badgeReserved },
            PENDING: { label: 'Pendente', className: styles.badgePending },
        };
        const info = map[status] || { label: status, className: styles.badgeDefault };
        return <span className={info.className}>{info.label}</span>;
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Todas as Atividades</h2>
                        <p className={styles.subtitle}>
                            Histórico completo de reservas e movimentações das suas rifas.
                            {!loading && ` (${total} registros)`}
                        </p>
                    </div>
                </div>

                <Card className={styles.tableCard}>
                    {loading ? (
                        <div className={styles.skeletonList}>
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} height="56px" marginBottom="8px" />
                            ))}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Activity size={48} />
                            <h3>Nenhuma atividade encontrada</h3>
                            <p>As atividades aparecerão aqui conforme as reservas forem feitas.</p>
                        </div>
                    ) : (
                        <div className={styles.activityList}>
                            {activities.map((act) => (
                                <div key={act.id} className={styles.activityRow}>
                                    <div className={styles.activityInfo}>
                                        <span className={styles.activityMessage}>{act.message}</span>
                                        <span className={styles.activityTime}>{act.time}</span>
                                    </div>
                                    <div className={styles.activityStatus}>
                                        {getStatusBadge(act.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {!loading && totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => goToPage(page - 1)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft size={18} />
                            Anterior
                        </button>
                        <div className={styles.pageInfo}>
                            <span>Página <strong>{page}</strong> de <strong>{totalPages}</strong></span>
                        </div>
                        <button
                            className={styles.pageBtn}
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Próxima
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
