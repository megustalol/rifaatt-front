'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import DezenasGrid from '@/components/rifa/DezenasGrid/DezenasGrid';
import RifaConfigForm from '@/components/rifa/RifaConfigForm/RifaConfigForm';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import Card from '@/components/ui/Card/Card';
import { Trophy, Share2, RefreshCcw, Search, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimalForNumber } from '@/utils/animalDictionary';
import clsx from 'clsx';
import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

export default function RifaPage() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [groupsLoading, setGroupsLoading] = useState(true);

    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await api.get('/raffles/groups');
                setGroups(response.data);
                if (response.data.length > 0) {
                    setSelectedGroupId(response.data[0].groupJid);
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setGroupsLoading(false);
            }
        };
        fetchGroups();
    }, []);

    useEffect(() => {
        if (!selectedGroupId) return;

        const fetchRaffle = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/raffles/active/${selectedGroupId}`);
                setRaffle(response.data);
            } catch (error) {
                console.error('Error fetching raffle:', error);
                setRaffle(null);
            } finally {
                setLoading(false);
            }
        };
        fetchRaffle();
    }, [selectedGroupId]);

    const handleDraw = () => {
        if (!raffle) return;
        setIsDrawing(true);
        setTimeout(() => {
            const paidDezenas = raffle.Reservations?.filter(r => r.status === 'PAID') || [];
            if (paidDezenas.length === 0) {
                alert('Nenhuma dezena paga para sortear!');
                setIsDrawing(false);
                return;
            }
            const winRes = paidDezenas[Math.floor(Math.random() * paidDezenas.length)];
            setWinner({
                number: winRes.number,
                name: winRes.buyerName,
                phone: winRes.buyerPhone
            });
            setIsDrawing(false);
            setIsWinnerModalOpen(true);
        }, 3000);
    };

    const dezenas = raffle ? (raffle.Reservations || []).map(r => ({
        number: r.number,
        status: r.status.toLowerCase() === 'paid' ? 'pago' : 'reservado',
        user: r.buyerName
    })) : [];

    const stats = {
        paid: dezenas.filter(d => d.status === 'pago').length,
        reserved: dezenas.filter(d => d.status === 'reservado').length,
        free: 100 - dezenas.length
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Gerenciar Rifa</h2>
                        <p className={styles.subtitle}>Configure prêmios, valores e acompanhe o grid em tempo real.</p>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="secondary" icon={Share2}>Compartilhar Grid</Button>
                        <Button
                            variant="primary"
                            icon={Trophy}
                            onClick={handleDraw}
                            disabled={!raffle || stats.paid === 0}
                        >
                            Realizar Sorteio
                        </Button>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.leftCol}>
                        {loading || groupsLoading ? (
                            <Skeleton height="300px" width="100%" />
                        ) : raffle ? (
                            <RifaConfigForm
                                config={{
                                    title: raffle.title,
                                    prize: raffle.prize,
                                    price: raffle.ticketValue,
                                    pixKey: raffle.pixKey,
                                    welcomeMsg: 'Rifa ativa no grupo.'
                                }}
                                onChange={() => { }} // Read only in this view
                                onSave={() => { }}
                            />
                        ) : (
                            <Card className={styles.noRaffleCard}>
                                <div className={styles.noRaffleContent}>
                                    <Trophy size={48} />
                                    <p>Nenhuma rifa ativa para este grupo.</p>
                                </div>
                            </Card>
                        )}

                        <Card className={styles.groupSelector}>
                            <label>Escolher Grupo</label>
                            {groupsLoading ? (
                                <Skeleton height="40px" width="100%" />
                            ) : (
                                <select
                                    className={styles.select}
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                >
                                    {groups.map(g => (
                                        <option key={g.groupJid} value={g.groupJid}>
                                            {g.groupName || g.groupJid}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </Card>
                    </div>

                    <div className={styles.rightCol}>
                        <div className={styles.gridHeader}>
                            <h3>Visualização do Grid (00-99)</h3>
                            <div className={styles.gridStats}>
                                {loading ? (
                                    <Skeleton width="200px" height="20px" />
                                ) : (
                                    <>
                                        <span>{stats.paid} Pagas</span>
                                        <span>{stats.reserved} Reservadas</span>
                                        <span>{stats.free} Livres</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {loading ? (
                            <div className={styles.gridLoading}>
                                <Loader2 className={styles.spin} />
                                <span>Carregando grid...</span>
                            </div>
                        ) : raffle ? (
                            <DezenasGrid dezenas={dezenas} />
                        ) : (
                            <div className={styles.emptyGrid}>
                                <p>Selecione um grupo com rifa ativa.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Winner Modal */}
                <Modal
                    isOpen={isWinnerModalOpen}
                    onClose={() => setIsWinnerModalOpen(false)}
                    title="🏆 Temos um Ganhador!"
                    size="sm"
                >
                    <div className={styles.winnerWrapper}>
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={styles.winnerNumber}
                        >
                            {winner?.number}
                        </motion.div>
                        <div className={styles.winnerInfo}>
                            <h4>{winner?.name}</h4>
                            <p>{winner?.phone?.split('@')[0]}</p>
                        </div>
                        <p className={styles.prizeLabel}>Ganhou: <strong>{raffle?.prize}</strong></p>
                        <Button fullWidth icon={Share2}>Notificar no WhatsApp</Button>
                    </div>
                </Modal>

                <AnimatePresence>
                    {isDrawing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.drawingOverlay}
                        >
                            <div className={styles.drawingContent}>
                                <RefreshCcw size={64} className={styles.spin} />
                                <h3>Sorteando número...</h3>
                                <p>O robô está processando as dezenas pagas.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

