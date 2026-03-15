'use client';

import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, XCircle, CheckCircle, Maximize2 } from 'lucide-react';
import styles from './UsersTable.module.css';
import Button from '@/components/ui/Button/Button';
import api from '@/services/api';
import UserDetailModal from '../UserDetailModal/UserDetailModal';

const UsersTable = ({ users = [], loading = false, onRefresh, plans = [], onEdit }) => {
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [planFilter, setPlanFilter] = useState('ALL');
    const [visualFilter, setVisualFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const isExpiringSoon = (date) => {
        if (!date) return false;
        const expiry = new Date(date);
        const now = new Date();
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
    };

    const formatDate = (date) => {
        if (!date) return 'Sem expiração';
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const togglePasswordVisibility = (userId) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

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

    const handleDeleteUser = async (user) => {
        if (confirm(`Tem certeza que deseja EXCLUIR permanentemente o usuário ${user.name}?`)) {
            try {
                await api.delete(`/users/${user.id}`);
                onRefresh();
            } catch (error) {
                alert('Erro ao excluir usuário: ' + (error.response?.data?.error || error.message));
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

    const clsx = (...args) => args.filter(Boolean).join(' ');

    const filteredUsers = users.filter((user) => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'ALL' || user.status === statusFilter;
        
        const matchesPlan = 
            planFilter === 'ALL' || 
            (planFilter === 'NONE' && !user.planId) || 
            user.planId === planFilter;

        const isExpiring = isExpiringSoon(user.planExpiresAt);
        const matchesVisual = 
            visualFilter === 'ALL' ||
            (visualFilter === 'ADMIN' && user.role === 'ADMIN') ||
            (visualFilter === 'BLOCKED' && user.status === 'BLOCKED') ||
            (visualFilter === 'EXPIRING' && isExpiring && user.status === 'ACTIVE') ||
            (visualFilter === 'FREE' && !user.planId && user.status === 'ACTIVE' && user.role !== 'ADMIN') ||
            (visualFilter === 'NORMAL' && user.planId && !isExpiring && user.status === 'ACTIVE' && user.role !== 'ADMIN');

        return matchesSearch && matchesStatus && matchesPlan && matchesVisual;
    });

    const MobileCard = ({ user }) => {
        const isExpiring = isExpiringSoon(user.planExpiresAt);
        const rowClass = user.role === 'ADMIN'
            ? styles.adminRow
            : user.status === 'BLOCKED' 
                ? styles.blockedRow 
                : isExpiring 
                    ? styles.expiringRow 
                    : !user.planId
                        ? styles.freeRow
                        : styles.activeRow;

        return (
            <div key={user.id} className={clsx(styles.userCard, rowClass)}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.cardTitle}>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                    </div>
                    <div className={styles.cardStatus}>
                        <div className={clsx(styles.statusBadgeSmall, user.status === 'ACTIVE' ? styles.active : styles.inactive)}>
                            {user.status === 'ACTIVE' ? 'Ativo' : 'Bloqueado'}
                        </div>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.cardInfoItem}>
                        <label>WhatsApp:</label>
                        <span>{user.phone || 'Sem número'}</span>
                    </div>
                    <div className={styles.cardInfoItem}>
                        <label>Senha:</label>
                        <div className={styles.cardPasswordWrapper}>
                            <span>{visiblePasswords[user.id] ? user.password_plain || 'N/A' : '••••••••'}</span>
                            <button 
                                className={styles.passwordToggle} 
                                onClick={() => togglePasswordVisibility(user.id)}
                            >
                                <Eye size={14} className={clsx(visiblePasswords[user.id] && styles.eyeActive)} />
                            </button>
                        </div>
                    </div>
                    <div className={styles.cardInfoItem}>
                        <label>Plano:</label>
                        <select 
                            value={user.planId || ''}
                            onChange={(e) => handleChangePlan(user.id, e.target.value)}
                            className={styles.cardPlanSelect}
                        >
                            <option value="">Sem Plano</option>
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    <Button variant="ghost" size="sm" icon={Search} onClick={() => handleViewDetails(user)} title="Ver detalhes" />
                    <Button variant="ghost" size="sm" icon={Edit2} onClick={() => onEdit(user)} title="Editar" />
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={user.status === 'ACTIVE' ? XCircle : CheckCircle} 
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'ACTIVE' ? "Bloquear" : "Ativar"}
                    />
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDeleteUser(user)} className={styles.deleteBtn} />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.legendContainer}>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.legendColor, styles.legendColorAdmin)}></div>
                    <span><strong>Safira:</strong> Administrador / Master</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.legendColor, styles.legendColorBlocked)}></div>
                    <span><strong>Vermelho:</strong> Usuário Bloqueado/Desativado</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.legendColor, styles.legendColorExpiring)}></div>
                    <span><strong>Amarelo:</strong> Plano vencendo em até 3 dias</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.legendColor, styles.legendColorFree)}></div>
                    <span><strong>Roxo:</strong> Plano Gratuito / Sem Plano</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={clsx(styles.legendColor, styles.legendColorActive)}></div>
                    <span><strong>Verde:</strong> Ativo e regular</span>
                </div>
            </div>

            <div className={styles.tableHeader}>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <select 
                            className={styles.filterSelect}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Todos os Status</option>
                            <option value="ACTIVE">Ativos</option>
                            <option value="BLOCKED">Bloqueados</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <select 
                            className={styles.filterSelect}
                            value={planFilter}
                            onChange={(e) => setPlanFilter(e.target.value)}
                        >
                            <option value="ALL">Todos os Planos</option>
                            <option value="NONE">Sem Plano</option>
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <select 
                            className={styles.filterSelect}
                            value={visualFilter}
                            onChange={(e) => setVisualFilter(e.target.value)}
                        >
                            <option value="ALL">Todas Situações</option>
                            <option value="ADMIN">Administradores</option>
                            <option value="EXPIRING">Vencendo Logo</option>
                            <option value="FREE">Sem Plano / Grátis</option>
                            <option value="BLOCKED">Bloqueados</option>
                            <option value="NORMAL">Regulares</option>
                        </select>
                    </div>
                </div>

                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar organizador..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.mobileCards}>
                {loading ? (
                    <div className={styles.centerText}>Carregando...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className={styles.emptyState}>Nenhum usuário encontrado.</div>
                ) : (
                    filteredUsers.map((user) => (
                        <MobileCard key={user.id} user={user} />
                    ))
                )}
            </div>

            <div className={styles.desktopTable}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>Organizador</th>
                                <th style={{ width: '15%' }}>WhatsApp</th>
                                <th style={{ width: '15%' }}>Senha</th>
                                <th style={{ width: '15%' }}>Plano</th>
                                <th style={{ width: '10%' }}>Status</th>
                                <th style={{ width: '10%' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className={styles.centerText}>Carregando...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} className={styles.centerText}>Nenhum usuário encontrado.</td></tr>
                            ) : filteredUsers.map((user) => {
                                const isExpiring = isExpiringSoon(user.planExpiresAt);
                                const rowClass = user.role === 'ADMIN'
                                    ? styles.adminRow
                                    : user.status === 'BLOCKED' 
                                        ? styles.blockedRow 
                                        : isExpiring 
                                            ? styles.expiringRow 
                                            : !user.planId
                                                ? styles.freeRow
                                                : styles.activeRow;
                                
                                return (
                                    <tr key={user.id} className={rowClass}>
                                        <td className={styles.userCell}>
                                            <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                            <div className={styles.info}>
                                                <span className={styles.name}>{user.name}</span>
                                                <span className={styles.email}>
                                                    {user.email} 
                                                    {user.planExpiresAt && (
                                                        <span className={isExpiring ? styles.expiringIndicator : ''}>
                                                            {isExpiring ? 'Vencendo logo' : `Expira em ${formatDate(user.planExpiresAt)}`}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.whatsappInfo}>
                                                <span className={styles.phoneNumber}>{user.phone || 'Sem número'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.passwordWrapper}>
                                                <span className={styles.passwordText}>
                                                    {visiblePasswords[user.id] ? user.password_plain || 'N/A' : '••••••••'}
                                                </span>
                                                <button 
                                                    className={styles.passwordToggle} 
                                                    onClick={() => togglePasswordVisibility(user.id)}
                                                    title={visiblePasswords[user.id] ? "Ocultar Senha" : "Mostrar Senha"}
                                                >
                                                    <Eye size={14} className={clsx(visiblePasswords[user.id] && styles.eyeActive)} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className={styles.planCell}>
                                            <select 
                                                className={styles.planSelect}
                                                value={user.planId || ''}
                                                onChange={(e) => handleChangePlan(user.id, e.target.value)}
                                            >
                                                <option value="">Sem Plano</option>
                                                {plans.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
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
                                                    className={styles.actionBtn}
                                                    onClick={() => handleViewDetails(user)}
                                                    title="Ver Detalhes"
                                                >
                                                    <Search size={16} />
                                                </button>
                                                <button 
                                                    className={styles.actionBtn}
                                                    onClick={() => onEdit(user)}
                                                    title="Editar Usuário"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className={clsx(styles.actionBtn, user.status === 'ACTIVE' ? styles.warning : styles.success)}
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.status === 'ACTIVE' ? 'Desativar' : 'Reativar'}
                                                >
                                                    {user.status === 'ACTIVE' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                                </button>
                                                <button 
                                                    className={clsx(styles.actionBtn, styles.delete)}
                                                    onClick={() => handleDeleteUser(user)}
                                                    title="Excluir Usuário"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                user={selectedUser} 
            />
        </div>
    );
};

export default UsersTable;
