'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import UsersTable from '@/components/master/UsersTable/UsersTable';
import PaymentsTable from '@/components/master/PaymentsTable/PaymentsTable';
import StatsCard from '@/components/dashboard/StatsCard/StatsCard';
import Card from '@/components/ui/Card/Card';
import { Users, DollarSign, TrendingUp, CreditCard, Plus } from 'lucide-react';
import styles from './page.module.css';
import clsx from 'clsx';
import PlansTable from '@/components/master/PlansTable/PlansTable';
import CreatePlanModal from '@/components/master/CreatePlanModal/CreatePlanModal';
import api from '@/services/api';
import Button from '@/components/ui/Button/Button';
import { useEffect } from 'react';

export default function MasterPage() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState(mockPayments);
    const [plans, setPlans] = useState([]);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        if (activeTab === 'plans') {
            fetchPlans();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
            const res = await api.get('/plans');
            setPlans(res.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoadingPlans(false);
        }
    };

    const handleSavePlan = async (payload, id) => {
        try {
            if (id) {
                await api.patch(`/plans/${id}`, payload);
            } else {
                await api.post('/plans', payload);
            }
            fetchPlans();
        } catch (error) {
            throw error;
        }
    };

    const handleDeletePlan = async (id) => {
        if (confirm('Tem certeza que deseja excluir este plano?')) {
            try {
                await api.delete(`/plans/${id}`);
                fetchPlans();
            } catch (error) {
                alert('Erro ao excluir plano: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const openCreateModal = () => {
        setEditingPlan(null);
        setIsPlanModalOpen(true);
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setIsPlanModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Painel Master</h2>
                        <p className={styles.subtitle}>Visão global do sistema, gestão de usuários e faturamento.</p>
                    </div>
                    {activeTab === 'plans' && (
                        <Button icon={Plus} onClick={openCreateModal}>Novo Plano</Button>
                    )}
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
                        <button
                            className={clsx(styles.tab, activeTab === 'plans' && styles.activeTab)}
                            onClick={() => setActiveTab('plans')}
                        >
                            Planos
                        </button>
                    </div>

                    <Card className={styles.tableCard}>
                        {activeTab === 'users' ? (
                            <UsersTable 
                                users={users} 
                                loading={loadingUsers} 
                                onRefresh={fetchUsers}
                                plans={plans}
                            />
                        ) : activeTab === 'payments' ? (
                            <PaymentsTable payments={mockPayments} />
                        ) : (
                            <PlansTable
                                plans={plans}
                                onEdit={openEditModal}
                                onDelete={handleDeletePlan}
                                loading={loadingPlans}
                            />
                        )}
                    </Card>
                </div>
            </div>

            <CreatePlanModal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                onCreate={handleSavePlan}
                planToEdit={editingPlan}
            />
        </DashboardLayout>
    );
}
