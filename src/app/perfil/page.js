'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import Button from '@/components/ui/Button/Button';
import { User as UserIcon, Lock, Mail, Save, Key, Zap, Calendar, History, ShieldCheck, Clock } from 'lucide-react';
import api from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [securityLoading, setSecurityLoading] = useState(false);
    
    const [accountData, setAccountData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Nunca';
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } catch (e) {
            return 'Data inválida';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
        } catch (e) {
            return 'Data inválida';
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put(`/users/${user.id}`, accountData);
            setUser({ ...user, ...res.data });
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert('As senhas não coincidem!');
        }

        setSecurityLoading(true);
        try {
            await api.put(`/users/${user.id}`, {
                password: passwordData.newPassword
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            alert('Senha atualizada com sucesso!');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Erro ao atualizar senha.');
        } finally {
            setSecurityLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Meu Perfil</h2>
                    <p className={styles.subtitle}>Gerencie suas informações pessoais e segurança da conta.</p>
                </div>

                <div className={styles.grid}>
                    {/* Plan Section */}
                    <div className={clsx(styles.card, styles.planCard)}>
                        <div className={styles.planContent}>
                            <div className={styles.planInfo}>
                                <div className={styles.planName}>
                                    <Zap size={24} className={styles.icon} />
                                    {user?.Plan?.name || 'Plano Gratuito'}
                                    <span className={styles.planBadge}>Ativo</span>
                                </div>
                                <div className={styles.planMeta}>
                                    <div className={styles.metaItem}>
                                        <Calendar size={16} />
                                        Expira em: {formatDate(user?.planExpiresAt)}
                                    </div>
                                    <div className={styles.metaItem}>
                                        <ShieldCheck size={16} />
                                        Status: {user?.status === 'ACTIVE' ? 'Conta Verificada' : 'Aguardando'}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.planAction}>
                                <Button variant="secondary" onClick={() => window.location.href='/checkout'}>
                                    Alterar Plano
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className={styles.card}>
                        <div className={styles.sectionTitle}>
                            <UserIcon size={20} className={styles.icon} />
                            Informações da Conta
                        </div>
                        <form onSubmit={handleAccountUpdate} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Nome Completo</label>
                                <input 
                                    type="text"
                                    value={accountData.name}
                                    onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                                    className={styles.input}
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>E-mail</label>
                                <input 
                                    type="email"
                                    value={accountData.email}
                                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                                    className={styles.input}
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>ID do Usuário</label>
                                <input 
                                    type="text"
                                    value={user?.id || ''}
                                    className={styles.input}
                                    disabled
                                />
                            </div>
                            <Button type="submit" icon={Save} loading={loading} className={styles.saveBtn}>
                                Salvar Alterações
                            </Button>
                        </form>
                    </div>

                    {/* Extra Info & Security */}
                    <div className={styles.extraCard}>
                        {/* Security */}
                        <div className={styles.card}>
                            <div className={styles.sectionTitle}>
                                <Lock size={20} className={styles.icon} />
                                Segurança & Senha
                            </div>
                            <form onSubmit={handlePasswordUpdate} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label>Nova Senha</label>
                                    <input 
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        className={styles.input}
                                        placeholder="Digite a nova senha"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Confirmar Nova Senha</label>
                                    <input 
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        className={styles.input}
                                        placeholder="Confirme a nova senha"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <Button type="submit" icon={Key} loading={securityLoading} className={styles.saveBtn}>
                                    Atualizar Senha
                                </Button>
                            </form>
                        </div>

                        {/* Usage Info */}
                        <div className={styles.card}>
                            <div className={styles.sectionTitle}>
                                <History size={20} className={styles.icon} />
                                Atividades da Conta
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>Membro desde</div>
                                <div className={styles.infoValue}>{formatDate(user?.createdAt)}</div>
                            </div>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>Último acesso</div>
                                <div className={styles.infoValue}>
                                    <Clock size={12} style={{ marginRight: 4, display: 'inline' }} />
                                    {formatDateTime(user?.lastLogin)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import clsx from 'clsx';
