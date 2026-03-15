'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Card from '@/components/ui/Card/Card';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
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
import { getAnimalForNumber } from '@/utils/animalDictionary';
import api from '@/services/api';

const COLORS = ['#1FC98E', '#3B82F6', '#F59E0B', '#EF4444'];

const UserProfileModal = ({ isOpen, onClose, user }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !user?.id) {
            setProfile(null);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const encoded = encodeURIComponent(user.id);
                const response = await api.get(`/reports/participant/${encoded}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching participant profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isOpen, user?.id]);

    if (!user) return null;

    const stats = profile?.stats || {};
    const spendingData = profile?.spendingData || [];
    const winHistory = profile?.winHistory || [];

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
                            {loading ? 'Carregando...' : `Visto por último em ${stats.lastSeen || '-'}`}
                        </p>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Total Investido</span>
                        {loading ? (
                            <Skeleton width="80px" height="20px" />
                        ) : (
                            <span className={styles.statValue}>{stats.totalSpent || 'R$ 0,00'}</span>
                        )}
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Participações</span>
                        {loading ? (
                            <Skeleton width="40px" height="20px" />
                        ) : (
                            <span className={styles.statValue}>{stats.totalRaffles || 0}</span>
                        )}
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Taxa de Vitória</span>
                        {loading ? (
                            <Skeleton width="40px" height="20px" />
                        ) : (
                            <span className={styles.statValue} style={{ color: 'var(--success)' }}>{stats.winRate || '0%'}</span>
                        )}
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    {/* Insights & Chart */}
                    <div className={styles.insights}>
                        <h4 className={styles.sectionTitle}>Distribuição por Grupo</h4>
                        {loading ? (
                            <Skeleton width="100%" height="160px" />
                        ) : spendingData.length > 0 ? (
                            <>
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
                            </>
                        ) : (
                            <div className={styles.emptyChart}>
                                <span>Sem dados de grupo</span>
                            </div>
                        )}
                    </div>

                    {/* Win History */}
                    <div className={styles.history}>
                        <h4 className={styles.sectionTitle}>Histórico de Prêmios</h4>
                        <div className={styles.winList}>
                            {loading ? (
                                <>
                                    <Skeleton height="50px" marginBottom="8px" />
                                    <Skeleton height="50px" marginBottom="8px" />
                                </>
                            ) : winHistory.length > 0 ? (
                                winHistory.map((win) => (
                                    <div key={win.id} className={styles.winItem}>
                                        <div className={styles.winIcon}>
                                            {win.number ? getAnimalForNumber(win.number).emoji : <Trophy size={16} />}
                                        </div>
                                        <div className={styles.winInfo}>
                                            <span className={styles.winRaffle}>{win.raffle} {win.number && `(${getAnimalForNumber(win.number).name})`}</span>
                                            <span className={styles.winDetails}>{win.prize} • {win.date}</span>
                                        </div>
                                        <ChevronRight size={14} className={styles.chevron} />
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyWins}>
                                    <Trophy size={20} />
                                    <span>Nenhum prêmio ainda</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserProfileModal;
