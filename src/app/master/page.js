'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import UsersTable from '@/components/master/UsersTable/UsersTable';
import PaymentsTable from '@/components/master/PaymentsTable/PaymentsTable';
import StatsCard from '@/components/dashboard/StatsCard/StatsCard';
import Card from '@/components/ui/Card/Card';
import { Users, TrendingUp, Smartphone, Zap, Plus, Search, Eye } from 'lucide-react';
import styles from './page.module.css';
import clsx from 'clsx';
import PlansTable from '@/components/master/PlansTable/PlansTable';
import CreatePlanModal from '@/components/master/CreatePlanModal/CreatePlanModal';
import UserModal from '@/components/master/UserModal/UserModal';
import LinkedUsersModal from '@/components/master/LinkedUsersModal/LinkedUsersModal';
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
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isLinkedUsersModalOpen, setIsLinkedUsersModalOpen] = useState(false);
    const [selectedPlanForUsers, setSelectedPlanForUsers] = useState(null);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [summary, setSummary] = useState({
        totalActiveGroups: 0,
        totalActiveInstances: 0,
        paidInactiveInstances: 0
    });
    const [settings, setSettings] = useState({
        asaas_api_key: '',
        asaas_webhook_secret: '',
        asaas_environment: 'sandbox'
    });
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        fetchSummary();
        if (activeTab === 'plans') {
            fetchPlans();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'settings') {
            fetchSettings();
        }
    }, [activeTab]);

    const fetchSummary = async () => {
        try {
            const res = await api.get('/master/summary');
            setSummary(res.data);
        } catch (error) {
            console.error('Error fetching master summary:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await api.get('/master/settings');
            setSettings({
                asaas_api_key: res.data.asaas_api_key || '',
                asaas_webhook_secret: res.data.asaas_webhook_secret || '',
                asaas_environment: res.data.asaas_environment || 'sandbox'
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

    const handleSaveUser = async (payload, id) => {
        try {
            if (id) {
                await api.put(`/users/${id}`, payload);
            } else {
                await api.post('/users/register', payload);
            }
            fetchUsers();
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

    const handleManageUsers = (plan) => {
        setSelectedPlanForUsers(plan);
        setIsLinkedUsersModalOpen(true);
    };

    const handleUpdatePlans = () => {
        fetchPlans();
    };

    const openCreateModal = () => {
        setEditingPlan(null);
        setIsPlanModalOpen(true);
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setIsPlanModalOpen(true);
    };

    const openCreateUserModal = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const openEditUserModal = (user) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
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
                    {activeTab === 'users' && (
                        <Button icon={Plus} onClick={openCreateUserModal}>Novo Usuário</Button>
                    )}
                </div>

                <div className={styles.statsGrid}>
                    <StatsCard 
                        label="Total de Usuários" 
                        value={users.length} 
                        icon={Users} 
                    />
                    <StatsCard 
                        label="Grupos em Execução" 
                        value={summary.totalActiveGroups} 
                        icon={TrendingUp} 
                        variation={`${summary.totalActiveGroups * 2}%`}
                    />
                    <StatsCard 
                        label="Instâncias Ativas" 
                        value={summary.totalActiveInstances} 
                        icon={Smartphone} 
                    />
                    <StatsCard 
                        label="Instâncias Pagas (Offline)" 
                        value={summary.paidInactiveInstances} 
                        icon={Zap} 
                        variant="warning"
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
                                onEdit={openEditUserModal}
                            />
                        ) : activeTab === 'payments' ? (
                            <PaymentsTable payments={payments} />
                        ) : activeTab === 'plans' ? (
                            <PlansTable
                                plans={plans}
                                onEdit={openEditModal}
                                onDelete={handleDeletePlan}
                                onManageUsers={handleManageUsers}
                                loading={loadingPlans}
                            />
                        ) : (
                            <div className={styles.settingsSection}>
                                <h3 className={styles.sectionTitle}>Configurações de Pagamento (Asaas)</h3>
                                <form onSubmit={handleSaveSettings} className={styles.settingsForm}>
                                    <div className={styles.inputGroup}>
                                        <label>Ambiente Asaas</label>
                                        <select 
                                            value={settings.asaas_environment}
                                            onChange={(e) => setSettings({...settings, asaas_environment: e.target.value})}
                                            className={styles.input}
                                        >
                                            <option value="sandbox">Sandbox (Teste)</option>
                                            <option value="production">Produção (Real)</option>
                                        </select>
                                        <p className={styles.inputHint}>Selecione &quot;Produção&quot; apenas quando estiver pronto para receber pagamentos reais.</p>
                                    </div>

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
                                        <label>Token de Segurança do Webhook</label>
                                        <input 
                                            type="password" 
                                            value={settings.asaas_webhook_secret}
                                            onChange={(e) => setSettings({...settings, asaas_webhook_secret: e.target.value})}
                                            placeholder="Inserir token de segurança"
                                            className={styles.input}
                                        />
                                        <p className={styles.inputHint}>Configure este mesmo token no painel do Asaas {'>'} Fila de Webhooks para validar as notificações.</p>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Webhook URL (Para copiar)</label>
                                        <div className={styles.copyInputGroup}>
                                            <input 
                                                type="text" 
                                                value="https://api.rifaatt.com/api/payments/webhook"
                                                readOnly
                                                className={styles.input}
                                                style={{ backgroundColor: 'var(--bg-main)', cursor: 'default' }}
                                            />
                                        </div>
                                        <p className={styles.inputHint}>Copie esta URL e cole no campo &quot;URL de destino&quot; nas configurações de Webhook do Asaas.</p>
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

            <UserModal 
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSave={handleSaveUser}
                userToEdit={editingUser}
                plans={plans}
            />

            <LinkedUsersModal 
                isOpen={isLinkedUsersModalOpen}
                onClose={() => setIsLinkedUsersModalOpen(false)}
                plan={selectedPlanForUsers}
                onUpdate={handleUpdatePlans}
            />
        </DashboardLayout>
    );
}

function calculateVariation(current, previous) {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
}
