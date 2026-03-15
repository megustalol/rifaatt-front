'use client';

import React from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import { Rocket, Sparkles } from 'lucide-react';
import styles from './OnboardingModal.module.css';

const TrialActivatedModal = ({ isOpen, onClose, userName }) => {
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
                <h2>Parabéns, {userName}!</h2>
                <p>
                    A administração liberou um <strong>período de teste gratuito</strong> para você explorar todas as ferramentas do Rifaatt.
                </p>
                <div className={styles.highlightBox}>
                    <Sparkles size={20} />
                    <span>Aproveite para criar suas instâncias e configurar seus grupos agora mesmo!</span>
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
