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
    MessageCircle,
    Plus
} from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';
import clsx from 'clsx';
import { getAnimalForNumber } from '@/utils/animalDictionary';

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
            const response = await api.get(`/raffles/active/${groupJid}`);
            const { group: groupData, raffle: raffleData } = response.data;
            
            setRaffle(raffleData);
            if (groupData) {
                setGroup({
                    name: groupData.groupName || 'Grupo',
                    instanceName: groupData.WhatsAppInstance?.name || 'Sistema',
                    phone: groupData.WhatsAppInstance?.phone || '',
                    startDate: new Date(groupData.createdAt).toLocaleDateString(),
                    membersCount: groupData.membersCount || 0,
                    members: groupData.Members || []
                });
            }
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

    if (!group) return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.emptyStateFull}>
                    <div className={styles.emptyStateContainer}>
                        <div className={styles.emptyIconWrapper}>
                            <Users size={48} />
                        </div>
                        <h3>Grupo não encontrado</h3>
                        <p>Não conseguimos localizar as informações deste grupo em sua conta.</p>
                        <Link href="/grupos" className={styles.emptyStateAction}>
                            <Button variant="primary">Voltar para a Lista</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );

    const total = 100;
    const reservations = raffle.Reservations || [];
    const paid = reservations.filter(r => r.status === 'PAID').length;
    const pending = reservations.filter(r => r.status === 'PENDING').length;
    const free = total - paid - pending;

    const paidPercent = (paid / total) * 100;
    const pendingPercent = (pending / total) * 100;

    // Group reservations by buyer to show in the list
    const participantMap = {};
    reservations.forEach(r => {
        if (!participantMap[r.buyerPhone]) {
            participantMap[r.buyerPhone] = {
                name: r.buyerName,
                phone: r.buyerPhone,
                numbers: [],
                paidCount: 0,
                pendingCount: 0
            };
        }
        participantMap[r.buyerPhone].numbers.push(r.number);
        if (r.status === 'PAID') participantMap[r.buyerPhone].paidCount++;
        else participantMap[r.buyerPhone].pendingCount++;
    });

    const participants = Object.values(participantMap);

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

                {!raffle ? (
                    <div className={styles.emptyStateFull}>
                        <div className={styles.emptyStateContainer}>
                            <div className={styles.emptyIconWrapper}>
                                <Trophy size={48} />
                            </div>
                            <h3>Nenhuma rifa ativa no momento</h3>
                            <p>O robô está conectado a este grupo, mas não há nenhuma rifa em andamento no momento.</p>
                            <div className={styles.emptyStateActions}>
                                <Link href="/rifas">
                                    <Button variant="primary" icon={Plus}>Criar Nova Rifa</Button>
                                </Link>
                                <Link href="/grupos">
                                    <Button variant="ghost">Voltar para Listagem</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        <Card className={styles.raffleCard}>
                            <div className={styles.cardHeader}>
                                <Ticket className={styles.cardIcon} />
                                <h3>Rifa Ativa: {raffle.title}</h3>
                            </div>

                            <div className={styles.raffleStats}>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>Preço p/ Dezena</span>
                                    <span className={styles.statValue}>R$ {raffle.ticketValue}</span>
                                </div>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>Prêmio</span>
                                    <span className={styles.statValue}>{raffle.prize || 'A definir'}</span>
                                </div>
                            </div>

                            <div className={styles.progressSection}>
                                <div className={styles.progressInfo}>
                                    <span>Progresso de Venda</span>
                                    <span>{Math.round(paidPercent + pendingPercent)}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.paga}
                                        style={{ width: `${paidPercent}%` }}
                                    />
                                    <div
                                        className={styles.reservada}
                                        style={{ width: `${pendingPercent}%` }}
                                    />
                                </div>
                                <div className={styles.legend}>
                                    <div className={styles.legendItem}>
                                        <div className={clsx(styles.dot, styles.bgPaga)} />
                                        <span>Pagos ({paid})</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={clsx(styles.dot, styles.bgReservada)} />
                                        <span>Pendentes ({pending})</span>
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

                        <Card className={styles.membersCard}>
                            <div className={styles.cardHeader}>
                                <Users className={styles.cardIcon} />
                                <h3>Participantes ({participants.length})</h3>
                            </div>

                            <div className={styles.membersList}>
                                {participants.length === 0 ? (
                                    <div className={styles.emptyMembers}>
                                        <p>Nenhuma reserva detectada ainda.</p>
                                    </div>
                                ) : (
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Usuário</th>
                                                <th>Dezenas</th>
                                                <th>Valor</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {participants.map((p) => (
                                                <tr key={p.phone}>
                                                    <td className={styles.userName}>
                                                        <div className={styles.avatar}>
                                                            {p.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div>{p.name}</div>
                                                            <div className={styles.phoneSub}>{p.phone.split('@')[0]}</div>
                                                        </div>
                                                    </td>
                                                    <td className={styles.phoneCell}>
                                                        <div className={styles.numberList}>
                                                            {p.numbers.map(num => (
                                                                <span key={num} className={styles.numberTag}>
                                                                    {getAnimalForNumber(num).emoji} {num}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className={styles.purchasesCell}>
                                                        R$ {(p.numbers.length * raffle.ticketValue).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        <div className={clsx(styles.statusBadge, p.pendingCount === 0 ? styles.online : styles.away)}>
                                                            {p.pendingCount === 0 ? 'Pago' : 'Pendente'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

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
