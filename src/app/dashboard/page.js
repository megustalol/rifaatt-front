'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed/ActivityFeed';
import Card from '@/components/ui/Card/Card';
import { Users, Smartphone, DollarSign, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import styles from './page.module.css';
import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get('/reports/dashboard/summary');
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.welcome}>
                        <h2 className={styles.title}>Olá{user.name ? `, ${user.name}` : ''} 👋</h2>
                        <p className={styles.subtitle}>Aqui está o resumo das suas rifas hoje.</p>
                    </div>
                    <Link href="/grupos">
                        <Button icon={ArrowRight}>Ver Minhas Rifas</Button>
                    </Link>
                </div>

                <div className={styles.statsGrid}>
                    {loading ? (
                        <>
                            <Skeleton height="140px" radius="16px" />
                            <Skeleton height="140px" radius="16px" />
                            <Skeleton height="140px" radius="16px" />
                        </>
                    ) : (
                        <>
                            <StatsCard
                                label="Grupos Ativos"
                                value={summary?.activeGroups || 0}
                                icon={Users}
                            />
                            <StatsCard
                                label="Instâncias Online"
                                value={summary?.activeInstances || 0}
                                icon={Smartphone}
                            />
                            <StatsCard
                                label="Faturamento Total"
                                value={summary?.totalValue.replace('R$ ', '') || '0,00'}
                                prefix="R$ "
                                icon={DollarSign}
                            />
                        </>
                    )}
                </div>

                <div className={styles.mainGrid}>
                    <section className={styles.feedSection}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Atividades Recentes</h3>
                            <button className={styles.viewAll}>Ver tudo</button>
                        </div>
                        <Card className={styles.feedCard}>
                            {loading ? (
                                <div style={{ padding: '20px' }}>
                                    <Skeleton height="50px" marginBottom="10px" />
                                    <Skeleton height="50px" marginBottom="10px" />
                                    <Skeleton height="50px" />
                                </div>
                            ) : (
                                <ActivityFeed activities={summary?.activities || []} />
                            )}
                        </Card>
                    </section>

                    <aside className={styles.promoSection}>
                        <Card className={styles.promoCard}>
                            <div className={styles.promoIcon}>🚀</div>
                            <h4>Escala sua Operação</h4>
                            <p>Adicione mais instâncias e grupos para aumentar seu alcance e faturamento.</p>
                            <Button variant="outline" fullWidth>Expandir Plano</Button>
                        </Card>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
}

import Link from 'next/link';
