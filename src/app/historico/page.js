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
import { getAnimalForNumber } from '@/utils/animalDictionary';

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}

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
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

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

    const filtered = history.filter(r => {
        const titleMatch = (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.groupName || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const date = new Date(r.drawDate || r.updatedAt);
        const start = dateStart ? new Date(dateStart + 'T00:00:00') : null;
        const end = dateEnd ? new Date(dateEnd + 'T23:59:59') : null;
        
        let dateMatch = true;
        if (start && date < start) dateMatch = false;
        if (end && date > end) dateMatch = false;

        return titleMatch && dateMatch;
    });

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
                    <Button 
                        variant={isFilterExpanded ? "primary" : "secondary"} 
                        icon={Filter}
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    >
                        {isFilterExpanded ? "Fechar Filtros" : "Mais Filtros"}
                    </Button>
                </div>

                {isFilterExpanded && (
                    <div className={styles.filterRow}>
                        <div className={styles.filterGroup}>
                            <div className={styles.dateField}>
                                <Calendar size={16} />
                                <span className={styles.filterLabel}>Período de:</span>
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
                                {(dateStart || dateEnd) && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className={styles.resetBtn}
                                        onClick={() => { setDateStart(''); setDateEnd(''); }}
                                    >
                                        Limpar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.contentArea}>
                    {loading ? (
                        <div className={styles.grid}>
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} height="300px" width="100%" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.emptyState}>
                            <History size={48} />
                            <h3>Nenhuma rifa encontrada</h3>
                            <p>O histórico aparecerá aqui assim que as rifas forem finalizadas.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className={styles.desktopTable}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Rifa</th>
                                            <th>Grupo</th>
                                            <th>Finalizada em</th>
                                            <th>Ganhador</th>
                                            <th>Vendido</th>
                                            <th style={{ textAlign: 'right' }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((raffle) => (
                                            <tr key={raffle.id}>
                                                <td>
                                                    <div className={styles.raffleNameCell}>
                                                        <span className={styles.raffleTitle}>{raffle.title}</span>
                                                        <span className={styles.raffleId}>#{raffle.id.slice(0, 8)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.groupCell}>
                                                        <Users size={14} />
                                                        {raffle.groupName || 'Grupo Geral'}
                                                    </div>
                                                </td>
                                                <td className={styles.dateCell}>
                                                    {new Date(raffle.drawDate || raffle.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div className={styles.winnerBadge}>
                                                        <span className={styles.winnerEmoji}>
                                                            {raffle.winningNumber ? getAnimalForNumber(raffle.winningNumber).emoji : '🏆'}
                                                        </span>
                                                        <span className={styles.winnerNum}>
                                                            {raffle.winningNumber || '---'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={styles.salesCell}>
                                                    <div className={styles.salesInfo}>
                                                        <strong>{raffle?.Reservations?.length || 0}</strong>
                                                        <span>bilhetes</span>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <Link href={`/grupos/${raffle.groupId || raffle.groupJid}`}>
                                                        <Button size="sm" variant="outline" icon={ArrowUpRight}>Relatório</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className={styles.mobileCards}>
                                {filtered.map((raffle) => (
                                    <div key={raffle.id} className={styles.mobileHistoryCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.raffleMain}>
                                                <h4>{raffle.title}</h4>
                                                <span className={styles.groupSub}>
                                                    <Users size={12} />
                                                    {raffle.groupName || 'Grupo Geral'}
                                                </span>
                                            </div>
                                            <span className={styles.mobileDate}>
                                                {new Date(raffle.drawDate || raffle.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className={styles.cardBody}>
                                            <div className={styles.cardWinner}>
                                                <Trophy size={14} />
                                                <span className={styles.winnerLabel}>Ganhador:</span>
                                                <span className={styles.winnerResult}>
                                                    {raffle.winningNumber ? `${raffle.winningNumber} (${getAnimalForNumber(raffle.winningNumber).name})` : 'Aguardando'}
                                                </span>
                                            </div>
                                            
                                            <div className={styles.cardMeta}>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Vendidos</span>
                                                    <span className={styles.metaValue}>{raffle?.Reservations?.length || 0} n°</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <span className={styles.metaLabel}>Valor</span>
                                                    <span className={styles.metaValueHighlight}>R$ {raffle.ticketValue}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link href={`/grupos/${raffle.groupId || raffle.groupJid}`} className={styles.cardAction}>
                                            <Button fullWidth icon={ArrowUpRight} variant="ghost">Relatório Completo</Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
