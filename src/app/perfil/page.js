'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import Button from '@/components/ui/Button/Button';
import { User as UserIcon, Lock, Mail, Save, Key } from 'lucide-react';
import api from '@/services/api';

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

                    {/* Security */}
                    <div className={styles.card}>
                        <div className={styles.sectionTitle}>
                            <Lock size={20} className={styles.icon} />
                            Segurança & Senha
                        </div>
                        <form onSubmit={handlePasswordUpdate} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Nova Senha</label>
                                <div className={styles.inputWrapper}>
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
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Confirmar Nova Senha</label>
                                <div className={styles.inputWrapper}>
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
                            </div>
                            <Button type="submit" icon={Key} loading={securityLoading} className={styles.saveBtn}>
                                Atualizar Senha
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
