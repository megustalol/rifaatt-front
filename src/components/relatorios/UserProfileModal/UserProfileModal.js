'use client';

import React from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Card from '@/components/ui/Card/Card';
import {
    Trophy,
    TrendingUp,
    ShoppingBag,
    Calendar,
    Hash,
    Target,
    Users,
    ChevronRight
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip
} from 'recharts';
import styles from './UserProfileModal.module.css';
import clsx from 'clsx';

const COLORS = ['#1FC98E', '#3B82F6', '#F59E0B', '#EF4444'];

const UserProfileModal = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    // Mock data for the specific user
    const stats = {
        totalSpent: 'R$ 1.240,00',
        totalRaffles: 124,
        winRate: '8%',
        winsCount: 3,
        bestGroup: 'Rifa do Churrasco',
        lastSeen: '10/03/2026'
    };

    const spendingData = [
        { name: 'Grupo Churrasco', value: 450 },
        { name: 'VIP Amigos', value: 300 },
        { name: 'Sorteio Mensal', value: 290 },
        { name: 'Outros', value: 200 },
    ];

    const winHistory = [
        { id: '1', raffle: 'Rifa de Natal', date: '24/12/2025', prize: 'R$ 500,00', group: 'Amigos do Bairro' },
        { id: '2', raffle: 'Sorteio iPhone 15', date: '15/01/2026', prize: 'iPhone 15 Pro', group: 'Rifa VIP SP' },
        { id: '3', raffle: 'Churrasco Jan', date: '30/01/2026', prize: 'Kit Churrasco Master', group: 'Rifa do Churrasco' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Perfil do Participante"
            size="md"
        >
            <div className={styles.container}>
                {/* Header Info */}
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        {user.name.charAt(0)}
                    </div>
                    <div className={styles.info}>
                        <h3 className={styles.name}>{user.name}</h3>
                        <p className={styles.subtext}>
                            <Calendar size={12} />
                            Visto por último em {stats.lastSeen}
                        </p>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Total Investido</span>
                        <span className={styles.statValue}>{stats.totalSpent}</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Participações</span>
                        <span className={styles.statValue}>{stats.totalRaffles}</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Taxa de Vitória</span>
                        <span className={styles.statValue} style={{ color: 'var(--success)' }}>{stats.winRate}</span>
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    {/* Insights & Chart */}
                    <div className={styles.insights}>
                        <h4 className={styles.sectionTitle}>Distribuição por Grupo</h4>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-surface-saturate)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '11px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.legend}>
                            {spendingData.map((item, index) => (
                                <div key={item.name} className={styles.legendItem}>
                                    <div className={styles.dot} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Win History */}
                    <div className={styles.history}>
                        <h4 className={styles.sectionTitle}>Histórico de Prêmios</h4>
                        <div className={styles.winList}>
                            {winHistory.map((win) => (
                                <div key={win.id} className={styles.winItem}>
                                    <div className={styles.winIcon}>
                                        <Trophy size={16} />
                                    </div>
                                    <div className={styles.winInfo}>
                                        <span className={styles.winRaffle}>{win.raffle}</span>
                                        <span className={styles.winDetails}>{win.prize} • {win.date}</span>
                                    </div>
                                    <ChevronRight size={14} className={styles.chevron} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserProfileModal;
