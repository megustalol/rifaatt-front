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
    const [payments, setPayments] = useState([]);
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
                    <StatsCard 
                        label="Total de Usuários" 
                        value={users.length} 
                        icon={Users} 
                        variation={calculateVariation(users.length, 1000)} // Mocked variation for now
                    />
                    <StatsCard 
                        label="Vaturamento Previsto" 
                        value={plans.length > 0 ? users.reduce((acc, user) => {
                            const userPlan = plans.find(p => p.id === user.planId);
                            return acc + (userPlan ? userPlan.price : 0);
                        }, 0) : 0} 
                        prefix="R$ " 
                        icon={DollarSign} 
                    />
                    <StatsCard 
                        label="Grupos Ativos" 
                        value={users.reduce((acc, user) => acc + (user.activeGroups || 0), 0)} 
                        icon={TrendingUp} 
                    />
                    <StatsCard 
                        label="Planos Ativos" 
                        value={plans.filter(p => p.status === 'active').length} 
                        icon={CreditCard} 
                    />
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
                            <PaymentsTable payments={payments} />
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

function calculateVariation(current, previous) {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
}
