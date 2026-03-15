'use client';

import React from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import { Rocket, Sparkles } from 'lucide-react';
import styles from './OnboardingModal.module.css';

const TrialActivatedModal = ({ isOpen, onClose, user }) => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Usuário';
    const plan = user?.Plan;
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            title="Período de Teste Ativado!"
            size="md"
        >
            <div className={styles.container}>
                <div className={styles.iconWrapperTrial}>
                    <Rocket size={48} />
                </div>
                <h2>Parabéns, {firstName}!</h2>
                <p>
                    A administração liberou um <strong>período de teste gratuito</strong> no plano <strong>{plan?.name || 'Premium'}</strong> para você explorar todas as ferramentas.
                </p>

                {plan && (
                    <div className={styles.planDetailsBox}>
                        <div className={styles.planDetailItem}>
                            <Sparkles size={16} />
                            <span><strong>{plan.instanceLimit}</strong> {plan.instanceLimit === 1 ? 'Instância de WhatsApp' : 'Instâncias de WhatsApp'}</span>
                        </div>
                        <div className={styles.planDetailItem}>
                            <Sparkles size={16} />
                            <span><strong>{plan.groupLimit}</strong> {plan.groupLimit === 1 ? 'Grupo Ativo' : 'Grupos Ativos'}</span>
                        </div>
                        <div className={styles.planDetailItem}>
                            <Sparkles size={16} />
                            <span><strong>{plan.durationDays} dias</strong> de acesso completo</span>
                        </div>
                    </div>
                )}

                <div className={styles.highlightBox}>
                    <span>Sua licença de teste é válida até <strong>{user?.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString('pt-BR') : '-'}</strong>.</span>
                </div>
                
                <div className={styles.actions}>
                    <Button onClick={onClose} size="lg" fullWidth>
                        Começar a Usar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TrialActivatedModal;
