'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import {
    History,
    Search,
    Filter,
    Trophy,
    Users,
    Calendar,
    ArrowUpRight,
    Users2,
    CheckCircle2
} from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';

const mockFinalizedRaffles = [
    {
        id: '101',
        name: 'Rifa de Natal 2025',
        group: 'Amigos do Bairro',
        finishDate: '24/12/2025',
        winners: ['Patrick Silva', 'Maria Oliveira'],
        totalSales: 'R$ 2.500,00',
        membersCount: 120
    },
    {
        id: '102',
        name: 'Sorteio iPhone 15',
        group: 'Rifa VIP São Paulo',
        finishDate: '15/01/2026',
        winners: ['João Pereira'],
        totalSales: 'R$ 8.900,00',
        membersCount: 450
    },
    {
        id: '103',
        name: 'Rifa do Churrasco Jan',
        group: 'Rifa do Churrasco',
        finishDate: '30/01/2026',
        winners: ['Alice Souza'],
        totalSales: 'R$ 1.200,00',
        membersCount: 42
    },
];

import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await api.get('/raffles/history');
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filtered = history.filter(r =>
        (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.groupName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Histórico de Rifas</h2>
                        <p className={styles.subtitle}>Consulte as rifas finalizadas e os ganhadores de cada grupo.</p>
                    </div>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.statCard}>
                        <CheckCircle2 className={styles.statIcon} />
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Total Finalizadas</span>
                            <span className={styles.statValue}>{loading ? '...' : history.length}</span>
                        </div>
                    </div>
                    {/* ... other stats could be calculated ... */}
                </div>

                <div className={styles.searchRow}>
                    <div className={styles.searchBar}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por rifa ou grupo..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" icon={Filter}>Mais Filtros</Button>
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <Skeleton key={i} height="300px" width="100%" />
                        ))
                    ) : filtered.length === 0 ? (
                        <div className={styles.emptyState}>
                            <History size={48} />
                            <h3>Nenhuma rifa encontrada</h3>
                            <p>O histórico aparecerá aqui assim que as rifas forem finalizadas.</p>
                        </div>
                    ) : (
                        filtered.map((raffle) => (
                            <Card key={raffle.id} className={styles.historyCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.raffleInfo}>
                                        <h4>{raffle.title}</h4>
                                        <span className={styles.groupName}>
                                            <Users size={14} />
                                            {raffle.groupName || 'Grupo Geral'}
                                        </span>
                                    </div>
                                    <span className={styles.dateBadge}>
                                        <Calendar size={12} />
                                        {new Date(raffle.drawDate || raffle.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className={styles.winnerSection}>
                                    <div className={styles.winnerHeader}>
                                        <Trophy size={16} />
                                        <span>Ganhador</span>
                                    </div>
                                    <div className={styles.winnerList}>
                                        <div className={styles.winnerItem}>
                                            <div className={styles.winnerAvatar}>
                                                {raffle.winningNumber ? '🏆' : '?'}
                                            </div>
                                            <span>Número: {raffle.winningNumber || 'Aguardando'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.salesRow}>
                                    <div className={styles.salesStat}>
                                        <span className={styles.salesLabel}>Valor do Bilhete</span>
                                        <span className={styles.salesValue}>R$ {raffle.ticketValue}</span>
                                    </div>
                                    <div className={styles.salesStat}>
                                        <span className={styles.salesLabel}>Vendido</span>
                                        <span className={styles.salesValue}>{raffle.Reservations?.length || 0} n°</span>
                                    </div>
                                </div>

                                <Link href={`/grupos/${raffle.groupId || raffle.groupJid}`} className={styles.detailsLink}>
                                    <Button fullWidth variant="ghost" className={styles.detailsBtn} icon={ArrowUpRight}>
                                        Ver Relatório Completo
                                    </Button>
                                </Link>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
