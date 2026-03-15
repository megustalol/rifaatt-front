'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Smartphone, Shield, CreditCard, Activity, Clock, Calendar, CheckCircle } from 'lucide-react';
import styles from './UserModal.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';

const UserModal = ({ isOpen, onClose, onSave, userToEdit, plans = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'CLIENT',
        planId: '',
        status: 'ACTIVE',
        planAccess: [],
        trialDays: '',
        planExpiresAt: null
    });
    const [loading, setLoading] = useState(false);

    const privatePlans = plans.filter(p => !p.isPublic);

    const isExpiringSoon = (date) => {
        if (!date) return false;
        const expiry = new Date(date);
        const now = new Date();
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
    };

    const formatDate = (date) => {
        if (!date) return 'Nunca expira';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name || '',
                email: userToEdit.email || '',
                phone: userToEdit.phone || '',
                password: '',
                role: userToEdit.role || 'CLIENT',
                planId: userToEdit.planId || '',
                status: userToEdit.status || 'ACTIVE',
                planAccess: userToEdit.accessiblePlans?.map(p => p.id) || [],
                trialDays: '',
                planExpiresAt: userToEdit.planExpiresAt || null
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'CLIENT',
                planId: '',
                status: 'ACTIVE',
                planAccess: [],
                trialDays: '',
                planExpiresAt: null
            });
        }
    }, [userToEdit, isOpen]);

    const handleTogglePlanAccess = (planId) => {
        setFormData(prev => {
            const current = [...prev.planAccess];
            const index = current.indexOf(planId);
            if (index > -1) current.splice(index, 1);
            else current.push(planId);
            return { ...prev, planAccess: current };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password;
            
            await onSave(payload, userToEdit?.id);
            onClose();
        } catch (error) {
            alert('Erro ao salvar usuário: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <Input
                            label="Nome Completo"
                            placeholder="Ex: João Silva"
                            icon={User}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="E-mail"
                            type="email"
                            placeholder="email@exemplo.com"
                            icon={Mail}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="WhatsApp"
                            placeholder="55819..."
                            icon={Smartphone}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            label={userToEdit ? "Nova Senha (opcional)" : "Senha"}
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!userToEdit}
                        />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Shield size={14} className={styles.labelIcon} /> Perfil de Acesso
                            </label>
                            <select
                                className={styles.select}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="CLIENT">Organizador (Cliente)</option>
                                <option value="ADMIN">Master (Administrador)</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <CreditCard size={14} className={styles.labelIcon} /> Plano
                            </label>
                            <select
                                className={styles.select}
                                value={formData.planId}
                                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                            >
                                <option value="">Nenhum Plano</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Activity size={14} className={styles.labelIcon} /> Status da Conta
                            </label>
                            <select
                                className={styles.select}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="ACTIVE">Ativo</option>
                                <option value="BLOCKED">Bloqueado</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <Input
                                label="Período Grátis (Dias)"
                                type="number"
                                placeholder="Ex: 30"
                                icon={Clock}
                                value={formData.trialDays}
                                onChange={(e) => setFormData({ ...formData, trialDays: e.target.value })}
                            />
                            <p className={styles.hint}>Define quantos dias o usuário terá de acesso gratuito.</p>
                        </div>

                        {userToEdit && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <Clock size={14} className={styles.labelIcon} /> Expiração Atual
                                </label>
                                <div className={clsx(styles.expiryValue, isExpiringSoon(formData.planExpiresAt) && styles.expiryWarning)}>
                                    {formData.planExpiresAt 
                                        ? formatDate(formData.planExpiresAt) 
                                        : (formData.planId ? 'Nunca expira' : 'Sem plano ativo')}
                                </div>
                                {!formData.planId && (
                                    <p className={styles.hint}>Usuário está no período gratuito ou sem plano.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {privatePlans.length > 0 && (
                        <div className={styles.accessSection}>
                            <h4 className={styles.sectionTitle}>
                                <Lock size={16} className={styles.titleIcon} /> Planos Personalizados Liberados
                            </h4>
                            <p className={styles.hint}>Selecione quais planos privados este usuário poderá ver no Checkout.</p>
                            <div className={styles.planAccessGrid}>
                                {privatePlans.map(plan => (
                                    <div 
                                        key={plan.id} 
                                        className={clsx(styles.planSelectItem, formData.planAccess.includes(plan.id) && styles.planSelectItemActive)}
                                        onClick={() => handleTogglePlanAccess(plan.id)}
                                    >
                                        <div className={styles.planSelectIcon}>
                                            {formData.planAccess.includes(plan.id) ? <CheckCircle size={14} /> : <div className={styles.circle} />}
                                        </div>
                                        <div className={styles.planSelectInfo}>
                                            <span className={styles.planSelectName}>{plan.name}</span>
                                            <span className={styles.planSelectPrice}>R$ {plan.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.footer}>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" loading={loading}>
                            {userToEdit ? 'Atualizar Usuário' : 'Criar Usuário'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
