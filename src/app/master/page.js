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
    const [settings, setSettings] = useState({
        asaas_api_key: '',
        asaas_webhook_url: ''
    });
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        if (activeTab === 'plans') {
            fetchPlans();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'settings') {
            fetchSettings();
        }
    }, [activeTab]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/master/settings');
            setSettings({
                asaas_api_key: res.data.asaas_api_key || '',
                asaas_webhook_url: res.data.asaas_webhook_url || ''
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await api.post('/master/settings', settings);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações.');
        } finally {
            setSavingSettings(false);
        }
    };

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
                        <button
                            className={clsx(styles.tab, activeTab === 'settings' && styles.activeTab)}
                            onClick={() => setActiveTab('settings')}
                        >
                            Configurações
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
                        ) : activeTab === 'plans' ? (
                            <PlansTable
                                plans={plans}
                                onEdit={openEditModal}
                                onDelete={handleDeletePlan}
                                loading={loadingPlans}
                            />
                        ) : (
                            <div className={styles.settingsSection}>
                                <h3 className={styles.sectionTitle}>Configurações de Pagamento (Asaas)</h3>
                                <form onSubmit={handleSaveSettings} className={styles.settingsForm}>
                                    <div className={styles.inputGroup}>
                                        <label>Asaas API Key</label>
                                        <input 
                                            type="password" 
                                            value={settings.asaas_api_key}
                                            onChange={(e) => setSettings({...settings, asaas_api_key: e.target.value})}
                                            placeholder="Inserir chave de API"
                                            className={styles.input}
                                        />
                                        <p className={styles.inputHint}>Obtenha sua chave em Minha Conta {'>'} Integração no painel do Asaas.</p>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Webhook URL (Exibição)</label>
                                        <input 
                                            type="text" 
                                            value={settings.asaas_webhook_url || 'https://geral-uazapiapi.r954jc.easypanel.host/api/payments/webhook'}
                                            readOnly
                                            className={styles.input}
                                            style={{ backgroundColor: 'var(--bg-main)', cursor: 'default' }}
                                        />
                                        <p className={styles.inputHint}>Esta é a URL que você deve colar no seu painel Asaas.</p>
                                    </div>

                                    <Button type="submit" loading={savingSettings} className={styles.saveSettingsBtn}>
                                        Salvar Configurações
                                    </Button>
                                </form>
                            </div>
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
