'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import {
    Users,
    Ticket,
    Smartphone,
    ChevronLeft,
    Calendar,
    Trophy,
    DollarSign,
    UserCircle,
    Copy,
    MessageCircle
} from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';
import clsx from 'clsx';

const mockGroupDetails = {
    id: '1',
    name: 'Rifa do Churrasco',
    phone: '+55 (11) 98765-4321',
    instanceName: 'Zé das Rifas',
    startDate: '10/01/2026',
    membersCount: 42,
    raffle: {
        name: 'Churrasco Premiado',
        status: 'active',
        price: 'R$ 10,00',
        totalNumbers: 100,
        paidNumbers: 65,
        reservedNumbers: 15,
        freeNumbers: 20,
        drawDate: 'A definir'
    },
    members: [
        { id: '1', name: 'Patrick Assis', phone: '+55 (11) 90000-1111', purchases: 15, status: 'online' },
        { id: '2', name: 'Alvaro Lima', phone: '+55 (11) 90000-2222', purchases: 10, status: 'offline' },
        { id: '3', name: 'Cainan Mendes', phone: '+55 (11) 90000-3333', purchases: 8, status: 'online' },
        { id: '4', name: 'João Silva', phone: '+55 (21) 99999-0000', purchases: 5, status: 'away' },
        { id: '5', name: 'Maria Souza', phone: '+55 (31) 88888-7777', purchases: 2, status: 'online' },
    ]
};

import { useParams } from 'next/navigation';
import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import RaffleFinalizeModal from '@/components/raffle/RaffleFinalizeModal/RaffleFinalizeModal';

export default function GroupDetailsPage() {
    const { id: groupJid } = useParams();
    const [group, setGroup] = useState(null);
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const groupRes = await api.get(`/raffles/active/${groupJid}`);
            setRaffle(groupRes.data);
            setGroup({
                name: groupRes.data?.groupName || 'Grupo',
                instanceName: groupRes.data?.WhatsAppInstance?.name || 'Sistema',
                phone: groupRes.data?.WhatsAppInstance?.phone || '',
                startDate: new Date(groupRes.data?.createdAt).toLocaleDateString(),
                membersCount: groupRes.data?.membersCount || 0,
                members: groupRes.data?.Members || []
            });
        } catch (error) {
            console.error('Error fetching group details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupJid]);

    if (loading) return (
        <DashboardLayout>
            <div className={styles.container}>
                <Skeleton height="100px" width="100%" marginBottom="20px" />
                <div className={styles.grid}>
                    <Skeleton height="400px" width="100%" />
                    <Skeleton height="400px" width="100%" />
                </div>
            </div>
        </DashboardLayout>
    );

    if (!raffle) return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h3>Nenhuma rifa ativa encontrada</h3>
                    <Link href="/grupos">
                        <Button variant="secondary">Voltar para Grupos</Button>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );

    const total = raffle.numbersCount || 100;
    const paid = raffle.Reservations?.filter(r => r.status === 'PAID').length || 0;
    const reserved = raffle.Reservations?.filter(r => r.status === 'RESERVED').length || 0;
    const free = total - paid - reserved;

    const paidPercent = (paid / total) * 100;
    const reservedPercent = (reserved / total) * 100;

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/grupos" className={styles.backLink}>
                        <ChevronLeft size={20} />
                        Voltar para Grupos
                    </Link>
                    <div className={styles.headerContent}>
                        <div className={styles.titleInfo}>
                            <h2 className={styles.title}>{group.name}</h2>
                            <div className={styles.badges}>
                                <div className={styles.badge}>
                                    <Smartphone size={14} />
                                    <span>{group.instanceName} {group.phone && `(${group.phone})`}</span>
                                </div>
                                <div className={styles.badge}>
                                    <Calendar size={14} />
                                    <span>Início: {group.startDate}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button variant="secondary" icon={MessageCircle}>Abrir no WhatsApp</Button>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {/* Raffle Summary */}
                    <Card className={styles.raffleCard}>
                        <div className={styles.cardHeader}>
                            <Ticket className={styles.cardIcon} />
                            <h3>Rifa Ativa: {raffle.title}</h3>
                        </div>

                        <div className={styles.raffleStats}>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Preço p/ Número</span>
                                <span className={styles.statValue}>R$ {raffle.ticketValue}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Sorteio</span>
                                <span className={styles.statValue}>{raffle.drawDate ? new Date(raffle.drawDate).toLocaleDateString() : 'A definir'}</span>
                            </div>
                        </div>

                        <div className={styles.progressSection}>
                            <div className={styles.progressInfo}>
                                <span>Progresso de Venda</span>
                                <span>{Math.round(paidPercent + reservedPercent)}%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.paga}
                                    style={{ width: `${paidPercent}%` }}
                                />
                                <div
                                    className={styles.reservada}
                                    style={{ width: `${reservedPercent}%` }}
                                />
                            </div>
                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <div className={clsx(styles.dot, styles.bgPaga)} />
                                    <span>Pagos ({paid})</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <div className={clsx(styles.dot, styles.bgReservada)} />
                                    <span>Reservados ({reserved})</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <div className={clsx(styles.dot, styles.bgLivre)} />
                                    <span>Livres ({free})</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            fullWidth
                            variant="primary"
                            className={styles.manageRifaBtn}
                            onClick={() => setIsFinalizeModalOpen(true)}
                        >
                            Finalizar Rifa
                        </Button>
                    </Card>

                    {/* Member List */}
                    <Card className={styles.membersCard}>
                        <div className={styles.cardHeader}>
                            <Users className={styles.cardIcon} />
                            <h3>Membros do Grupo ({group.membersCount})</h3>
                        </div>

                        <div className={styles.membersList}>
                            {group.members.length === 0 ? (
                                <div className={styles.emptyMembers}>
                                    <p>Nenhum membro detectado ainda.</p>
                                </div>
                            ) : (
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Telefone</th>
                                            <th>Participações</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.members.map((member) => (
                                            <tr key={member.id}>
                                                <td className={styles.userName}>
                                                    <div className={styles.avatar}>
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    {member.name}
                                                </td>
                                                <td className={styles.phoneCell}>{member.phone}</td>
                                                <td className={styles.purchasesCell}>
                                                    <div className={styles.purchaseBadge}>
                                                        <Trophy size={14} />
                                                        {member.purchases || 0} números
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={clsx(styles.statusBadge, styles[member.status || 'online'])}>
                                                        {member.status === 'away' ? 'Ocupado' : member.status === 'offline' ? 'Offline' : 'Ativo'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <Button fullWidth variant="secondary" className={styles.viewAllBtn}>Ver Todos os Membros</Button>
                    </Card>
                </div>

                <RaffleFinalizeModal
                    isOpen={isFinalizeModalOpen}
                    onClose={() => setIsFinalizeModalOpen(false)}
                    raffle={raffle}
                    onRaffleFinalized={fetchData}
                />
            </div>
        </DashboardLayout>
    );
}
