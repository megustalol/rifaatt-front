'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed/ActivityFeed';
import Card from '@/components/ui/Card/Card';
import { Users, Smartphone, DollarSign, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import styles from './page.module.css';

const mockActivities = [
    { id: '1', type: 'group_activated', message: 'Grupo "Rifa do Churrasco" ativado com sucesso.', time: 'há 5 minutos' },
    { id: '2', type: 'new_reservation', message: 'Nova reserva: dezena 42 por João Silva no grupo VIP.', time: 'há 12 minutos' },
    { id: '3', type: 'payment_confirmed', message: 'Pagamento confirmado: R$ 20,00 de Maria Oliveira.', time: 'há 25 minutos' },
    { id: '4', type: 'instance_disconnected', message: 'Instância "Zé das Rifas" desconectou. Verifique sua conexão.', time: 'há 1 hora' },
    { id: '5', type: 'system_alert', message: 'Assinatura do grupo "Rifa Solidária" vence em 3 dias.', time: 'há 2 horas' },
];

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.welcome}>
                        <h2 className={styles.title}>Olá, Lucas 👋</h2>
                        <p className={styles.subtitle}>Aqui está o resumo das suas rifas hoje.</p>
                    </div>
                    <Button icon={ArrowRight}>Ver Minhas Rifas</Button>
                </div>

                <div className={styles.statsGrid}>
                    <StatsCard
                        label="Grupos Ativos"
                        value={12}
                        variation={8}
                        icon={Users}
                    />
                    <StatsCard
                        label="Instâncias Online"
                        value={3}
                        variation={0}
                        icon={Smartphone}
                    />
                    <StatsCard
                        label="Saldo Estimado"
                        value={1450}
                        prefix="R$ "
                        variation={12}
                        icon={DollarSign}
                    />
                </div>

                <div className={styles.mainGrid}>
                    <section className={styles.feedSection}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Atividades Recentes</h3>
                            <button className={styles.viewAll}>Ver tudo</button>
                        </div>
                        <Card className={styles.feedCard}>
                            <ActivityFeed activities={mockActivities} />
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
