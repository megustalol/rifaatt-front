'use client';

import React from 'react';
import { Search, MoreVertical, Edit2, Trash2, Mail } from 'lucide-react';
import styles from './UsersTable.module.css';
import Button from '@/components/ui/Button/Button';

const UsersTable = ({ users = [], loading = false, onRefresh, plans = [] }) => {
    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        const action = newStatus === 'BLOCKED' ? 'bloquear' : 'desbloquear';
        
        if (confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) {
            try {
                await api.patch(`/users/${user.id}/status`, { status: newStatus });
                onRefresh();
            } catch (error) {
                alert('Erro ao atualizar status: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const handleChangePlan = async (userId, planId) => {
        try {
            await api.patch(`/users/${userId}/plan`, { planId });
            onRefresh();
        } catch (error) {
            alert('Erro ao atualizar plano: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableHeader}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input type="text" placeholder="Buscar organizador..." />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Organizador</th>
                            <th>WhatsApp</th>
                            <th>Plano</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className={styles.centerText}>Carregando...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className={styles.centerText}>Nenhum usuário encontrado.</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id}>
                                <td className={styles.userCell}>
                                    <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                    <div className={styles.info}>
                                        <span className={styles.name}>{user.name}</span>
                                        <span className={styles.email}>{user.email}</span>
                                    </div>
                                </td>
                                <td className={styles.phoneCell}>{user.phone}</td>
                                <td className={styles.planCell}>
                                    <select 
                                        className={styles.planSelect}
                                        value={user.planId || ''}
                                        onChange={(e) => handleChangePlan(user.id, e.target.value)}
                                    >
                                        <option value="">Sem Plano</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <span className={clsx(styles.badge, user.status === 'ACTIVE' ? styles.active : styles.inactive)}>
                                        {user.status === 'ACTIVE' ? 'Ativo' : 'Bloqueado'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button 
                                            className={clsx(styles.actionBtn, user.status === 'ACTIVE' ? styles.delete : styles.success)}
                                            onClick={() => handleToggleStatus(user)}
                                            title={user.status === 'ACTIVE' ? 'Bloquear' : 'Desbloquear'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button className={styles.actionBtn}><Mail size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
