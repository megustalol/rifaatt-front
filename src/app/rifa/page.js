'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import DezenasGrid from '@/components/rifa/DezenasGrid/DezenasGrid';
import RifaConfigForm from '@/components/rifa/RifaConfigForm/RifaConfigForm';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import Card from '@/components/ui/Card/Card';
import { Trophy, Share2, RefreshCcw, Search, Loader2, Plus, Smartphone, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimalForNumber } from '@/utils/animalDictionary';
import clsx from 'clsx';
import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

export default function RifaPage() {
    const [viewMode, setViewMode] = useState('LIST'); // 'LIST' or 'MANAGE'
    const [dashboardData, setDashboardData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [isDrawOptionsModalOpen, setIsDrawOptionsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [manualNumber, setManualNumber] = useState('');

    const [newRifaConfig, setNewRifaConfig] = useState({
        title: '',
        prize: '',
        price: 10,
        pixKey: '',
        numbersCount: 100,
        welcomeMsg: ''
    });

    const fetchDashboard = async () => {
        setDashboardLoading(true);
        try {
            const response = await api.get('/raffles/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setDashboardLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleSelectGroup = async (group) => {
        setSelectedGroup(group);
        setViewMode('MANAGE');
        setLoading(true);
        try {
            // Re-fetch full raffle data for management - ALWAYS USE THE RECORD ID (group.id)
            const response = await api.get(`/raffles/active/${group.groupJid}`);
            setRaffle(response.data.raffle);
        } catch (error) {
            console.error('Error fetching raffle:', error);
            setRaffle(null);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = (group) => {
        setSelectedGroup(group);
        setNewRifaConfig({
            title: '',
            prize: '',
            price: 10,
            pixKey: '',
            numbersCount: 100,
            welcomeMsg: ''
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateRifa = async () => {
        if (!newRifaConfig.title || !newRifaConfig.prize || !newRifaConfig.pixKey) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/raffles', {
                ...newRifaConfig,
                groupJid: selectedGroup.groupJid,
                instanceId: selectedGroup.instanceId,
                ticketValue: parseFloat(newRifaConfig.price)
            });
            setIsCreateModalOpen(false);
            fetchDashboard();
            if (viewMode === 'MANAGE') {
                handleSelectGroup(selectedGroup);
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao criar rifa');
        } finally {
            setLoading(false);
        }
    };

    const handleDrawOptions = () => {
        if (!raffle) return;
        setIsDrawOptionsModalOpen(true);
    };

    const handleRandomDraw = () => {
        setIsDrawOptionsModalOpen(false);
        setIsDrawing(true);
        setTimeout(() => {
            const paidDezenas = raffle?.Reservations?.filter(r => r.status === 'PAID') || [];
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

    const handleManualDraw = () => {
        if (!manualNumber) {
            alert('Por favor, informe a dezena.');
            return;
        }

        const res = raffle?.Reservations?.find(r => r.number === manualNumber && r.status === 'PAID');
        if (!res) {
            alert('Esta dezena não está paga ou não existe.');
            return;
        }

        setWinner({
            number: res.number,
            name: res.buyerName,
            phone: res.buyerPhone
        });
        setIsDrawOptionsModalOpen(false);
        setIsWinnerModalOpen(true);
    };

    const handleFinalizeRaffle = async () => {
        if (!winner) return;
        setLoading(true);
        try {
            await api.post(`/raffles/finalize/${raffle.id}`, { winningNumber: winner.number });
            setIsWinnerModalOpen(false);
            fetchDashboard();
            handleSelectGroup(selectedGroup);
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao finalizar rifa');
        } finally {
            setLoading(false);
        }
    };

    const dezenas = (raffle?.Reservations || []).map(r => ({
        number: r.number,
        status: r.status?.toLowerCase() === 'paid' ? 'pago' : 'reservado',
        user: r.buyerName
    }));

    const stats = {
        paid: dezenas.filter(d => d.status === 'pago').length,
        reserved: dezenas.filter(d => d.status === 'reservado').length,
        free: (raffle?.numbersCount || 100) - dezenas.length
    };

    const renderListing = () => (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2 className={styles.title}>Minhas Rifas</h2>
                    <p className={styles.subtitle}>Gerencie suas rifas ativas ou crie novas para seus grupos.</p>
                </div>
            </div>

            {dashboardLoading ? (
                <div className={styles.dashboardGrid}>
                    {[1, 2, 3].map(i => <Skeleton key={i} height="280px" />)}
                </div>
            ) : dashboardData.length === 0 ? (
                <div className={styles.emptyStateFull}>
                    <div className={styles.emptyStateContainer}>
                        <div className={styles.emptyIconWrapper}>
                            <Trophy size={48} />
                        </div>
                        <h3>Ops! Nenhuma rifa por aqui</h3>
                        <p>Para criar suas rifas e automatizar suas vendas, você primeiro precisa configurar um grupo de WhatsApp.</p>
                        <Link href="/grupos" className={styles.emptyStateAction}>
                            <Button variant="primary" icon={Plus}>Ativar Novo Grupo</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className={styles.dashboardGrid}>
                    {dashboardData.map((item) => (
                        <Card 
                            key={item.id} 
                            className={styles.dashboardCard}
                            onClick={() => handleSelectGroup(item)}
                        >
                            <div className={styles.cardTop}>
                                <div className={styles.groupInfo}>
                                    <h3>{item.groupName}</h3>
                                    <div className={styles.groupInstance}>
                                        <Smartphone size={14} />
                                        <span>{item.WhatsAppInstance?.name}</span>
                                    </div>
                                </div>
                                <div className={clsx(
                                    styles.statusBadge,
                                    item.latestRaffle?.status === 'ACTIVE' ? styles.statusActive : 
                                    item.latestRaffle?.status === 'FINISHED' ? styles.statusFinished : styles.statusEmpty
                                )}>
                                    {item.latestRaffle?.status === 'ACTIVE' ? 'Em Andamento' : 
                                     item.latestRaffle?.status === 'FINISHED' ? 'Finalizada' : 'Sem Rifa'}
                                </div>
                            </div>

                            {item.latestRaffle ? (
                                <div className={styles.raffleInfo}>
                                    <div className={styles.raffleTitle}>{item.latestRaffle.title}</div>
                                    <div className={styles.raffleDetails}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Progresso</span>
                                            <span className={styles.detailValue}>
                                                {Math.round(((item.latestRaffle.stats?.paid + item.latestRaffle.stats?.reserved) / item.latestRaffle.stats?.total) * 100)}%
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Pagos</span>
                                            <span className={styles.detailValue}>{item.latestRaffle.stats?.paid} dezenas</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyRaffleInfo}>
                                    <p>Nenhuma rifa configurada.</p>
                                </div>
                            )}

                            <div className={styles.cardFooter}>
                                {item.latestRaffle ? (
                                    <Button 
                                        fullWidth 
                                        variant="primary"
                                        onClick={(e) => { e.stopPropagation(); handleSelectGroup(item); }}
                                    >
                                        Gerenciar Rifa
                                    </Button>
                                ) : (
                                    <div className={styles.emptyActions}>
                                        <Button 
                                            variant="secondary"
                                            className={styles.flex1}
                                            onClick={(e) => { e.stopPropagation(); handleSelectGroup(item); }}
                                        >
                                            Ver Grupo
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            icon={Plus}
                                            className={styles.flex1}
                                            onClick={(e) => { e.stopPropagation(); handleOpenCreateModal(item); }}
                                        >
                                            Nova Rifa
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const renderManage = () => (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <div className={styles.backAction} onClick={() => setViewMode('LIST')}>
                        <ChevronLeft size={20} />
                        <span>Voltar para lista</span>
                    </div>
                    <h2 className={styles.title}>Gerenciar Rifa</h2>
                    <p className={styles.subtitle}>{selectedGroup?.groupName} — Acompanhe o grid em tempo real.</p>
                </div>
                <div className={styles.actions}>
                    <Button
                        variant="primary"
                        icon={Trophy}
                        onClick={handleDrawOptions}
                        disabled={!raffle || stats.paid === 0}
                    >
                        Realizar Sorteio
                    </Button>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.leftCol}>
                    {loading ? (
                        <Skeleton height="300px" width="100%" />
                    ) : raffle ? (
                        <RifaConfigForm
                            config={{
                                title: raffle.title,
                                prize: raffle.prize,
                                price: raffle.ticketValue,
                                pixKey: raffle.pixKey,
                                welcomeMsg: raffle.status === 'ACTIVE' ? 'Rifa ativa no grupo.' : 'Rifa finalizada.'
                            }}
                            onChange={() => { }} // Read only in this view
                            onSave={() => { }}
                            lockPrice={!!raffle}
                        />
                    ) : (
                        <Card className={styles.noRaffleCard}>
                            <div className={styles.noRaffleContent}>
                                <Trophy size={48} />
                                <p>Nenhuma rifa ativa para este grupo.</p>
                                <Button 
                                    variant="primary" 
                                    className={styles.mt4}
                                    onClick={() => handleOpenCreateModal(selectedGroup)}
                                >
                                    Criar Primeira Rifa
                                </Button>
                            </div>
                        </Card>
                    )}
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
                        <DezenasGrid dezenas={dezenas} totalNumbers={raffle.numbersCount || 100} />
                    ) : (
                        <div className={styles.emptyGrid}>
                            <p>Esta rifa ainda não possui reservas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, x: viewMode === 'LIST' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: viewMode === 'LIST' ? 20 : -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {viewMode === 'LIST' ? renderListing() : renderManage()}
                </motion.div>
            </AnimatePresence>

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
                    <Button fullWidth icon={Share2} onClick={handleFinalizeRaffle} loading={loading}>
                        Finalizar e Notificar no WhatsApp
                    </Button>
                </div>
            </Modal>

            {/* Draw Options Modal */}
            <Modal
                isOpen={isDrawOptionsModalOpen}
                onClose={() => setIsDrawOptionsModalOpen(false)}
                title="Realizar Sorteio"
                size="md"
            >
                <div className={styles.drawOptionsGrid}>
                    <div className={styles.drawOptionCard} onClick={handleRandomDraw}>
                        <div className={styles.drawOptionIcon}>🎲</div>
                        <h4>Sorteio Aleatório</h4>
                        <p>O sistema escolherá uma dezena paga aleatoriamente.</p>
                        <Button variant="secondary" fullWidth>Sortear Agora</Button>
                    </div>
                    <div className={styles.drawOptionCard}>
                        <div className={styles.drawOptionIcon}>🎯</div>
                        <h4>Definir Ganhador</h4>
                        <p>Escolha manualmente a dezena vencedora (deve estar paga).</p>
                        <Input 
                            placeholder="Ex: 42" 
                            value={manualNumber} 
                            onChange={(e) => setManualNumber(e.target.value)}
                            className={styles.manualInput}
                        />
                        <Button variant="primary" fullWidth onClick={handleManualDraw}>Confirmar Ganhador</Button>
                    </div>
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
            {/* Create Raffle Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title={`Criar Nova Rifa - ${selectedGroup?.groupName}`}
                size="md"
            >
                <RifaConfigForm
                    config={newRifaConfig}
                    onChange={(field, value) => setNewRifaConfig(prev => ({ ...prev, [field]: value }))}
                    onSave={handleCreateRifa}
                />
            </Modal>
        </DashboardLayout>
    );
}



