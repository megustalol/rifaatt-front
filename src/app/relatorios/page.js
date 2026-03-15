'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Tabs from '@/components/ui/Tabs/Tabs';
import {
    Users,
    Trophy,
    TrendingDown,
    TrendingUp,
    ShoppingBag,
    BarChart3,
    Calendar,
    Filter,
    Inbox
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import styles from './page.module.css';
import clsx from 'clsx';

import UserProfileModal from '@/components/relatorios/UserProfileModal/UserProfileModal';

const mockRecurrent = [
    { id: '1', name: 'Patrick Assis', participations: 124, groups: 12, value: 'R$ 1.240,00' },
    { id: '2', name: 'Maria Oliveira', participations: 98, groups: 8, value: 'R$ 980,00' },
    { id: '3', name: 'João Silva', participations: 85, groups: 15, value: 'R$ 850,00' },
    { id: '4', name: 'Alvaro Lima', participations: 62, groups: 5, value: 'R$ 620,00' },
];

const mockWinners = [
    { id: '2', name: 'Maria Oliveira', wins: 5, totalWon: 'R$ 2.450,00', luck: '82%' },
    { id: '1', name: 'Patrick Assis', wins: 3, totalWon: 'R$ 1.200,00', luck: '45%' },
    { id: '5', name: 'Alice Souza', wins: 2, totalWon: 'R$ 500,00', luck: '15%' },
];

const mockLosers = [
    { id: '6', name: 'Cainan Mendes', participations: 45, wins: 0, spent: 'R$ 450,00' },
    { id: '3', name: 'João Silva', participations: 85, wins: 1, spent: 'R$ 850,00' },
    { id: '7', name: 'Luis Carlos', participations: 32, wins: 0, spent: 'R$ 320,00' },
];

const chartData = [
    { name: 'Seg', v: 400 },
    { name: 'Ter', v: 300 },
    { name: 'Qua', v: 600 },
    { name: 'Qui', v: 800 },
    { name: 'Sex', v: 500 },
    { name: 'Sab', v: 900 },
    { name: 'Dom', v: 1100 },
];

import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('recorentes');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ chartData: [], totalSales: 'R$ 0,00', trend: '0%' });
    const [rankings, setRankings] = useState({ recurrent: [], winners: [], losers: [], buyers: [] });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, rankingsRes] = await Promise.all([
                    api.get('/reports/sales-stats'),
                    api.get('/reports/top-users')
                ]);
                setStats(statsRes.data);
                setRankings(rankingsRes.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setIsProfileModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Relatórios & Analytics</h2>
                        <p className={styles.subtitle}>Acompanhe o desempenho dos usuários, recorrência e estatísticas de vendas.</p>
                    </div>
                </div>

                <div className={styles.statsOverview}>
                    <Card className={styles.statCard}>
                        <StatChart 
                            loading={loading} 
                            data={stats.chartData} 
                            color="var(--primary)" 
                        />
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Total Arrecadado</span>
                            {loading ? (
                                <Skeleton width="120px" height="24px" margin="4px 0" />
                            ) : (
                                <span className={styles.statValue}>{stats.totalSales || 'R$ 0,00'}</span>
                            )}
                            <span className={styles.statTrend} style={{ color: 'var(--success)' }}>
                                {loading ? '...' : stats.trend || '0%'} vs anterior
                            </span>
                        </div>
                    </Card>
                    <Card className={styles.statCard}>
                        <StatChart 
                            loading={loading} 
                            data={stats.chartData} 
                            color="#3b82f6" 
                        />
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Total de Reservas</span>
                            {loading ? (
                                <Skeleton width="80px" height="24px" margin="4px 0" />
                            ) : (
                                <span className={styles.statValue}>{rankings.recurrent.reduce((acc, curr) => acc + curr.participations, 0)}</span>
                            )}
                            <span className={styles.statTrend} style={{ color: 'var(--success)' }}>Atividade Geral</span>
                        </div>
                    </Card>
                </div>

                <Tabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    tabs={[
                        { id: 'recorentes', label: 'Top Recorrentes', icon: Users },
                        { id: 'compradores', label: 'Maiores Compradores', icon: ShoppingBag },
                        { id: 'ganhadores', label: 'Top Ganhadores', icon: Trophy },
                        { id: 'perdedores', label: 'Maiores Perdedores', icon: TrendingDown },
                    ]}
                />

                <div className={styles.tabContent}>
                    {loading ? (
                        <Card className={styles.rankingCard}>
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} height="50px" width="100%" margin="10px 0" />
                            ))}
                        </Card>
                    ) : (
                        <>
                            {activeTab === 'recorentes' && (
                                <RankingTable
                                    data={rankings.recurrent}
                                    cols={['Participações', 'Grupos', 'Total Investido']}
                                    keys={['participations', 'groups', 'value']}
                                    onViewProfile={handleViewProfile}
                                />
                            )}
                            {activeTab === 'compradores' && (
                                <RankingTable
                                    data={rankings.buyers}
                                    cols={['Total Comprado', 'Qtd. Grupos', 'Ticket Médio']}
                                    keys={['value', 'groups', 'participations']}
                                    onViewProfile={handleViewProfile}
                                />
                            )}
                            {activeTab === 'ganhadores' && (
                                <RankingTable
                                    data={rankings.winners}
                                    cols={['Prêmios', 'Total Ganho', 'Índice de Sorte']}
                                    keys={['wins', 'totalWon', 'luck']}
                                    onViewProfile={handleViewProfile}
                                />
                            )}
                            {activeTab === 'perdedores' && (
                                <RankingTable
                                    data={rankings.losers}
                                    cols={['Participações', 'Prêmios', 'Total Investido']}
                                    keys={['participations', 'wins', 'spent']}
                                    onViewProfile={handleViewProfile}
                                />
                            )}
                        </>
                    )}
                </div>

                <UserProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={selectedUser}
                />
            </div>
        </DashboardLayout>
    );
}

function RankingTable({ data, cols, keys, onViewProfile }) {
    if (!data || data.length === 0) {
        return (
            <Card className={styles.emptyCard}>
                <div className={styles.emptyContent}>
                    <Inbox size={48} className={styles.emptyIcon} />
                    <h3>Sem dados para exibir</h3>
                    <p>Ainda não há participações suficientes para gerar este ranking.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className={styles.rankingWrapper}>
            <Card className={styles.rankingCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>Rank</th>
                            <th>Usuário</th>
                            {cols.map(c => <th key={c}>{c}</th>)}
                            <th style={{ textAlign: 'right' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className={clsx(styles.rankIdx, index === 0 && styles.rankFirst)}>
                                        {index + 1}
                                    </div>
                                </td>
                                <td className={styles.userName}>
                                    <div className={styles.avatar}>
                                        {item.name.charAt(0)}
                                    </div>
                                    {item.name}
                                </td>
                                {keys.map(k => (
                                    <td key={k} className={styles.valCell}>{item[k]}</td>
                                ))}
                                <td style={{ textAlign: 'right' }}>
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => onViewProfile(item)}
                                    >
                                        Ver Perfil
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div className={styles.mobileCards}>
                {data.map((item, index) => (
                    <Card key={index} className={styles.mobileCard}>
                        <div className={styles.mobileCardHeader}>
                            <div className={clsx(styles.rankIdx, index === 0 && styles.rankFirst)}>
                                {index + 1}
                            </div>
                            <div className={styles.userName}>
                                <div className={styles.avatar}>
                                    {item.name.charAt(0)}
                                </div>
                                {item.name}
                            </div>
                        </div>
                        <div className={styles.mobileCardBody}>
                            {cols.map((col, i) => (
                                <div key={i} className={styles.mobileDetail}>
                                    <span className={styles.mobileLabel}>{col}</span>
                                    <span className={styles.mobileValue}>{item[keys[i]]}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.mobileCardFooter}>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => onViewProfile(item)}
                            >
                                Ver Perfil Completo
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function StatChart({ loading, data, color }) {
    const isEmpty = !data || data.length === 0 || data.every(d => d.v === 0);

    return (
        <div className={styles.chartWrapper}>
            {loading ? (
                <Skeleton height="100px" width="100%" />
            ) : isEmpty ? (
                <div className={styles.emptyChartPlaceholder}>
                    <div className={styles.emptyBar} />
                    <div className={styles.emptyBar} style={{ width: '60%' }} />
                    <div className={styles.emptyBar} style={{ width: '80%' }} />
                    <span>Sem dados</span>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={data}>
                        <Bar dataKey="v" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
