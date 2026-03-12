'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import UsersTable from '@/components/master/UsersTable/UsersTable';
import PaymentsTable from '@/components/master/PaymentsTable/PaymentsTable';
import StatsCard from '@/components/dashboard/StatsCard/StatsCard';
import Card from '@/components/ui/Card/Card';
import { Users, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import styles from './page.module.css';
import clsx from 'clsx';

const mockUsers = [
    { id: '1', name: 'Lucas Silva', email: 'lucas@rifa.com', phone: '11987654321', activeGroups: 5, totalSpent: 245.00, status: 'active' },
    { id: '2', name: 'Maria Santos', email: 'maria@gmail.com', phone: '21988887777', activeGroups: 2, totalSpent: 99.80, status: 'active' },
    { id: '3', name: 'José Souza', email: 'jose@uol.com.br', phone: '31977776666', activeGroups: 0, totalSpent: 49.90, status: 'inactive' },
];

const mockPayments = [
    { id: '1', date: '10/03/2026', user: 'Lucas Silva', group: 'Rifa do iPhone', amount: 49.90, status: 'paid' },
    { id: '2', date: '09/03/2026', user: 'Maria Santos', group: 'Rifa Amigos', amount: 49.90, status: 'paid' },
    { id: '3', date: '08/03/2026', user: 'José Souza', group: 'Sorteio Mensal', amount: 49.90, status: 'pending' },
];

export default function MasterPage() {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Painel Master</h2>
                        <p className={styles.subtitle}>Visão global do sistema, gestão de usuários e faturamento.</p>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <StatsCard label="Total de Usuários" value={1250} icon={Users} variation={15} />
                    <StatsCard label="Vaturamento Mensal" value={8450} prefix="R$ " icon={DollarSign} variation={22} />
                    <StatsCard label="Grupos Ativos" value={342} icon={TrendingUp} variation={12} />
                    <StatsCard label="Inadimplência" value={2} suffix="%" icon={CreditCard} trend="down" variation={1} />
                </div>

                <div className={styles.tableSection}>
                    <div className={styles.tabHeader}>
                        <button
                            className={clsx(styles.tab, activeTab === 'users' && styles.activeTab)}
                            onClick={() => setActiveTab('users')}
                        >
                            Organizadores
                        </button>
                        <button
                            className={clsx(styles.tab, activeTab === 'payments' && styles.activeTab)}
                            onClick={() => setActiveTab('payments')}
                        >
                            Pagamentos
                        </button>
                    </div>

                    <Card className={styles.tableCard}>
                        {activeTab === 'users' ? (
                            <UsersTable users={mockUsers} />
                        ) : (
                            <PaymentsTable payments={mockPayments} />
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
