'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { Trophy, AlertTriangle } from 'lucide-react';
import styles from './RaffleFinalizeModal.module.css';
import api from '@/services/api';

export default function RaffleFinalizeModal({ isOpen, onClose, raffle, onRaffleFinalized }) {
    const [winningNumber, setWinningNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFinalize = async () => {
        if (!winningNumber) {
            setError('Por favor, informe o número sorteado.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post(`/raffles/finalize/${raffle.id}`, { winningNumber });
            onRaffleFinalized();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao finalizar rifa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Rifa">
            <div className={styles.container}>
                <div className={styles.info}>
                    <Trophy className={styles.icon} />
                    <h3>{raffle?.title}</h3>
                    <p>Ao finalizar, o sistema enviará automaticamente uma mensagem para o vencedor e para o grupo no WhatsApp.</p>
                </div>

                <div className={styles.form}>
                    <label className={styles.label}>Número Sorteado</label>
                    <Input
                        type="text"
                        placeholder="Ex: 42 ou 042"
                        value={winningNumber}
                        onChange={(e) => setWinningNumber(e.target.value)}
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <div className={styles.warning}>
                    <AlertTriangle size={16} />
                    <span>Esta ação não pode ser desfeita.</span>
                </div>

                <div className={styles.actions}>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button variant="primary" onClick={handleFinalize} loading={loading}>
                        Finalizar e Notificar Ganhador
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
