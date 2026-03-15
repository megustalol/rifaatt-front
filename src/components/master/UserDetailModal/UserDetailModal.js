'use client';

import React from 'react';
import { X, Smartphone, Users, Activity, Shield, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import styles from './UserDetailModal.module.css';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';

const UserDetailModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const plan = user.Plan || {};
    const instances = user.WhatsAppInstances || [];
    
    // Calculate total active groups across all instances
    const activeGroups = instances.reduce((acc, inst) => acc + (inst.GroupActivations?.length || 0), 0);
    const activeInstances = instances.filter(inst => inst.status === 'CONNECTED').length;

    const formatDate = (date) => {
        if (!date) return 'Nunca expira';
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h3>{user.name}</h3>
                            <p className={styles.email}>{user.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.metricsGrid}>
                        <div className={styles.metricCard}>
                            <div className={styles.metricHeader}>
                                <Smartphone size={16} className={styles.icon} />
                                <span>Instâncias</span>
                            </div>
                            <div className={styles.metricValue}>
                                {activeInstances} <span className={styles.limit}>/ {plan.instanceLimit || 0}</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progress} 
                                    style={{ width: `${Math.min((activeInstances / (plan.instanceLimit || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className={styles.metricCard}>
                            <div className={styles.metricHeader}>
                                <Users size={16} className={styles.icon} />
                                <span>Grupos Ativos</span>
                            </div>
                            <div className={styles.metricValue}>
                                {activeGroups} <span className={styles.limit}>/ {plan.groupLimit || 0}</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progress} 
                                    style={{ width: `${Math.min((activeGroups / (plan.groupLimit || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className={styles.metricCard}>
                            <div className={styles.metricHeader}>
                                <Shield size={16} className={styles.icon} />
                                <span>Plano Atual</span>
                            </div>
                            <div className={styles.planName}>{plan.name || 'Sem Plano'}</div>
                            <div className={styles.planExpiry}>
                                <Calendar size={12} /> Expira em: {formatDate(user.planExpiresAt)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailsGrid}>
                        <section className={styles.section}>
                            <h4 className={styles.sectionTitle}>Instâncias do Usuário</h4>
                            <div className={styles.list}>
                                {instances.length > 0 ? instances.map(inst => (
                                    <div key={inst.id} className={styles.listItem}>
                                        <div className={styles.itemMain}>
                                            <span className={styles.itemName}>{inst.name}</span>
                                            <span className={styles.itemKey}>{inst.instanceKey}</span>
                                        </div>
                                        <div className={styles.itemStatus}>
                                            <span className={inst.status === 'CONNECTED' ? styles.statusOnline : styles.statusOffline}>
                                                {inst.status === 'CONNECTED' ? 'Online' : 'Offline'}
                                            </span>
                                            <Activity size={14} className={inst.status === 'CONNECTED' ? styles.pulse : ''} />
                                        </div>
                                    </div>
                                )) : (
                                    <div className={styles.empty}>Nenhuma instância criada.</div>
                                )}
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h4 className={styles.sectionTitle}>
                                <CreditCard size={14} /> Histórico de Pagamentos/Ativações
                            </h4>
                            <div className={styles.list}>
                                {instances.some(i => i.GroupActivations?.length > 0) ? instances.flatMap(inst => inst.GroupActivations || []).map(group => (
                                    <div key={group.id} className={styles.listItem}>
                                        <div className={styles.itemMain}>
                                            <span className={styles.itemName}>{group.groupName || 'Ativação de Grupo'}</span>
                                            <span className={styles.itemDetails}>Instância: {inst.name}</span>
                                        </div>
                                        <div className={styles.paymentInfo}>
                                            <span className={styles.paymentDate}>{new Date(group.createdAt).toLocaleDateString()}</span>
                                            <span className={styles.paymentAmount}>Pago</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className={styles.empty}>Nenhum pagamento registrado.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserDetailModal;
