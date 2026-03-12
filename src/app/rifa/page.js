'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import DezenasGrid from '@/components/rifa/DezenasGrid/DezenasGrid';
import RifaConfigForm from '@/components/rifa/RifaConfigForm/RifaConfigForm';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import { Trophy, Share2, RefreshCcw, Search } from 'lucide-react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const mockDezenas = [
    { number: '05', status: 'pago', user: 'Lucas Silva' },
    { number: '12', status: 'pago', user: 'Maria Santos' },
    { number: '24', status: 'reservado', user: 'José Souza' },
    { number: '42', status: 'pago', user: 'Ana Paula' },
    { number: '77', status: 'reservado', user: 'Ricardo Lima' },
    { number: '99', status: 'pago', user: 'Beatriz Costa' },
];

export default function RifaPage() {
    const [config, setConfig] = useState({
        title: 'Rifa do iPhone 15 Pro',
        prize: 'iPhone 15 Pro Max 256GB',
        price: '20.00',
        pixKey: 'financeiro@rifatt.com',
        welcomeMsg: 'Bem-vindo ao grupo de rifas! Escolha suas dezenas...'
    });

    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const handleConfigChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleDraw = () => {
        setIsDrawing(true);
        // Simulate drawing animation
        setTimeout(() => {
            setWinner({
                number: '42',
                name: 'Ana Paula',
                phone: '+55 11 91234-5678'
            });
            setIsDrawing(false);
            setIsWinnerModalOpen(true);
        }, 3000);
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
                        <Button variant="primary" icon={Trophy} onClick={handleDraw}>Realizar Sorteio</Button>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.leftCol}>
                        <RifaConfigForm
                            config={config}
                            onChange={handleConfigChange}
                            onSave={() => console.log('Save', config)}
                        />

                        <Card className={styles.groupSelector}>
                            <label>Grupo Selecionado</label>
                            <select className={styles.select}>
                                <option>Rifa do iPhone 15 Pro (Grupo VIP)</option>
                                <option>Rifa do Churrasco (Amigos)</option>
                            </select>
                        </Card>
                    </div>

                    <div className={styles.rightCol}>
                        <div className={styles.gridHeader}>
                            <h3>Visualização do Grid (00-99)</h3>
                            <div className={styles.gridStats}>
                                <span>4 Pagas</span>
                                <span>2 Reservadas</span>
                                <span>94 Livres</span>
                            </div>
                        </div>
                        <DezenasGrid dezenas={mockDezenas} />
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
                            <p>{winner?.phone}</p>
                        </div>
                        <p className={styles.prizeLabel}>Ganhou: <strong>{config.prize}</strong></p>
                        <Button fullWidth icon={Share2}>Notificar no WhatsApp</Button>
                    </div>
                </Modal>

                {/* Drawing Overlay */}
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

function Card({ children, className }) {
    return (
        <div className={clsx(styles.card, className)}>
            {children}
        </div>
    );
}

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
