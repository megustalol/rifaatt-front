'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import { Users, CheckCircle, XCircle, AlertTriangle, QrCode, Smartphone, Plus, Search, Calendar, ExternalLink } from 'lucide-react';
import styles from './page.module.css';
import clsx from 'clsx';
import CreateGroupModal from '@/components/grupos/CreateGroupModal/CreateGroupModal';
import Link from 'next/link';

import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

const statusStyles = {
    active: { label: 'Ativo', color: 'success', icon: CheckCircle },
    inactive: { label: 'Inativo', color: 'danger', icon: XCircle },
    pending: { label: 'Pendente', color: 'warning', icon: AlertTriangle }
};

export default function GruposPage() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [paymentStep, setPaymentStep] = useState('pix');
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [instances, setInstances] = useState([]);

    // Filters state
    const [filterInstance, setFilterInstance] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [groupsRes, instancesRes] = await Promise.all([
                api.get('/raffles/groups'), // Need to ensure this endpoint exists
                api.get('/instances')
            ]);
            setGroups(groupsRes.data);
            setInstances(instancesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGroups = groups.filter(group => {
        const matchesInstance = filterInstance === '' || group.instanceId === filterInstance;
        const matchesSearch = group.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
            group.jid.includes(filterSearch);
        return matchesInstance && matchesSearch;
    });

    const handleActivate = (group) => {
        setSelectedGroup(group);
        setPaymentStep('pix');
        setIsCheckoutOpen(true);
    };

    const simulatePayment = () => {
        setTimeout(() => {
            setPaymentStep('success');
        }, 3000);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Meus Grupos</h2>
                        <p className={styles.subtitle}>Gerencie os grupos onde o robô está ativo e suas assinaturas.</p>
                    </div>
                    <div className={styles.headerActions}>
                        <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Novo Grupo</Button>
                        <div className={styles.summaryStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Total</span>
                                <span className={styles.statValue}>{loading ? '...' : groups.length}</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Ativos</span>
                                <span className={styles.statValue} style={{ color: 'var(--success)' }}>
                                    {loading ? '...' : groups.filter(g => g.status === 'active').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.filtersWrapper}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou JID..."
                            className={styles.searchInput}
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <div className={styles.selectWrapper}>
                            <Smartphone size={16} className={styles.filterIcon} />
                            <select
                                className={styles.filterSelect}
                                value={filterInstance}
                                onChange={(e) => setFilterInstance(e.target.value)}
                            >
                                <option value="">Todas Instâncias</option>
                                {instances.map(inst => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.dateWrapper}>
                            <Calendar size={16} className={styles.filterIcon} />
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                            />
                            <span className={styles.dateSeparator}>até</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Card variant="default" className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome do Grupo</th>
                                    <th>Instância</th>
                                    <th>Data de Início</th>
                                    <th>Última Atividade</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={6}><Skeleton height="40px" width="100%" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredGroups.map((group) => {
                                        const status = statusStyles[group.status] || statusStyles.inactive;
                                        const StatusIcon = status.icon;

                                        return (
                                            <tr key={group.id}>
                                                <td className={styles.groupName}>
                                                    <div className={styles.groupIcon}>
                                                        <Users size={16} />
                                                    </div>
                                                    <span>{group.groupName || group.name}</span>
                                                </td>
                                                <td className={styles.phoneCell}>
                                                    <div className={styles.phoneBadge}>
                                                        <Smartphone size={14} />
                                                        {group.phone}
                                                    </div>
                                                </td>
                                                <td className={styles.dateCell}>{group.startDate || group.createdAt}</td>
                                                <td className={styles.activityCell}>{group.lastUpdate || 'N/A'}</td>
                                                <td>
                                                    <div className={clsx(styles.badge, styles[status.color])}>
                                                        <StatusIcon size={12} />
                                                        <span>{status.label}</span>
                                                    </div>
                                                </td>
                                                <td className={styles.actionsCell}>
                                                    <Link href={`/grupos/${group.id}`} passHref>
                                                        <Button variant="ghost" size="sm" icon={ExternalLink}>Entrar</Button>
                                                    </Link>
                                                    <Button
                                                        variant={group.status === 'active' ? 'secondary' : 'primary'}
                                                        size="sm"
                                                        onClick={() => handleActivate(group)}
                                                    >
                                                        {group.status === 'active' ? 'Assinatura' : 'Ativar'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Checkout Modal */}
                <Modal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    title={paymentStep === 'pix' ? 'Ativar Assinatura' : 'Sucesso!'}
                    size="sm"
                >
                    {paymentStep === 'pix' ? (
                        <div className={styles.checkout}>
                            <div className={styles.checkoutInfo}>
                                <p className={styles.planName}>Plano Mensal (30 dias)</p>
                                <h4 className={styles.planPrice}>R$ 49,90</h4>
                                <p className={styles.checkoutDesc}>Grupo: {selectedGroup?.name}</p>
                            </div>

                            <div className={styles.qrContainer}>
                                <div className={styles.qrCodePlaceholder}>
                                    <QrCode size={180} />
                                </div>
                                <p className={styles.checkoutTip}>Escaneie o QR Code PIX para ativar instantaneamente.</p>
                                <div className={styles.pulseLoader}>
                                    <div className={styles.dot} />
                                    <span>Aguardando pagamento...</span>
                                </div>
                            </div>

                            <Button fullWidth onClick={simulatePayment}>Simular Pagamento (Dev)</Button>
                        </div>
                    ) : (
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>
                                <CheckCircle size={64} />
                            </div>
                            <h3>Pagamento Confirmado!</h3>
                            <p>O robô já está ativo no grupo <strong>{selectedGroup?.name}</strong>.</p>
                            <Button variant="primary" fullWidth onClick={() => setIsCheckoutOpen(false)}>Concluído</Button>
                        </div>
                    )}
                </Modal>

                <CreateGroupModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={() => fetchInitialData()}
                />
            </div>
        </DashboardLayout>
    );
}
