'use client';

import React, { useState, useEffect } from 'react';
import styles from './LinkedUsersModal.module.css';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import { Search, UserPlus, X, Trash2, AlertCircle, Info, UserCheck, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import api from '@/services/api';

const LinkedUsersModal = ({ isOpen, onClose, plan, onUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (user) => {
        const updatedUsers = [...(plan.allowedUsers || []), user.id];
        try {
            await api.put(`/admin/plans/${plan.id}`, { allowedUsers: updatedUsers });
            onUpdate();
        } catch (error) {
            console.error('Erro ao vincular usuário:', error);
        }
    };

    const handleRemoveRequest = (user) => {
        // Simulação de lógica de verificação se o usuário está usando o plano
        // Na prática, isso viria de uma verificação de GroupActivation ativos
        const isCurrentlyUsing = user.status === 'ACTIVE'; // Simplificação para o dashboard

        if (isCurrentlyUsing) {
            setUserToRemove(user);
            setShowWarningModal(true);
        } else {
            proceedRemoval(user.id);
        }
    };

    const proceedRemoval = async (userId) => {
        const updatedUsers = (plan.allowedUsers || []).filter(id => id !== userId);
        try {
            await api.put(`/admin/plans/${plan.id}`, { allowedUsers: updatedUsers });
            setShowWarningModal(false);
            onUpdate();
        } catch (error) {
            console.error('Erro ao desvincular usuário:', error);
        }
    };

    const filteredUsers = allUsers.filter(u => 
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !plan.allowedUsers?.includes(u.id)
    );

    const linkedUsersData = allUsers.filter(u => plan.allowedUsers?.includes(u.id));

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Gerenciar Acesso: ${plan?.name}`} width="600px">
                <div className={styles.container}>
                    <div className={styles.section}>
                        <h3>Usuários Vinculados</h3>
                        <div className={styles.userList}>
                            {linkedUsersData.length === 0 ? (
                                <div className={styles.emptyState}>Nenhum usuário vinculado a este plano.</div>
                            ) : (
                                linkedUsersData.map(user => (
                                    <div key={user.id} className={styles.userItem}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                            <div>
                                                <div className={styles.userName}>{user.name}</div>
                                                <div className={styles.userEmail}>{user.email}</div>
                                            </div>
                                        </div>
                                        <div className={styles.userActions}>
                                            {user.status === 'ACTIVE' && (
                                                <div className={styles.usingBadge}>
                                                    <Info size={12} /> Em Uso
                                                </div>
                                            )}
                                            <button 
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveRequest(user)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.section}>
                        <h3>Adicionar Novo Usuário</h3>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar usuários..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.availableList}>
                            {filteredUsers.slice(0, 5).map(user => (
                                <div key={user.id} className={styles.availableItem}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatarSmall}>{user.name.charAt(0)}</div>
                                        <div>
                                            <div className={styles.userNameSmall}>{user.name}</div>
                                            <div className={styles.userEmailSmall}>{user.email}</div>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        icon={UserPlus} 
                                        onClick={() => handleAddUser(user)}
                                    >
                                        Vincular
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal 
                isOpen={showWarningModal} 
                onClose={() => setShowWarningModal(false)} 
                title="Aviso de Segurança"
                width="450px"
            >
                <div className={styles.warningContainer}>
                    <div className={styles.warningIcon}>
                        <ShieldAlert size={48} />
                    </div>
                    <h2>Usuário em Atividade!</h2>
                    <p>
                        O usuário <strong>{userToRemove?.name}</strong> possui produtos ativos vinculados a este plano no momento.
                    </p>
                    <div className={styles.warningBox}>
                        <AlertCircle size={16} />
                        <span>
                            Se você desvincular agora, o usuário continuará com acesso até que seus grupos/instâncias expirem por data. Novas renovações deste plano serão bloqueadas.
                        </span>
                    </div>
                    <div className={styles.warningActions}>
                        <Button variant="secondary" onClick={() => setShowWarningModal(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => proceedRemoval(userToRemove?.id)}>Desvincular Mesmo Assim</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default LinkedUsersModal;
