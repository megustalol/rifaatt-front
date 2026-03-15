'use client';

import React from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import { CreditCard, AlertCircle } from 'lucide-react';
import styles from './OnboardingModal.module.css';
import { useRouter } from 'next/navigation';

const PaymentRequiredModal = ({ isOpen, onClose, userName }) => {
    const router = useRouter();

    const handleCheckout = () => {
        onClose();
        router.push('/checkout');
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {}} // Force decision
            showClose={false}
            title="Ativação de Plano"
            size="md"
        >
            <div className={styles.container}>
                <div className={styles.iconWrapperPayment}>
                    <CreditCard size={48} />
                </div>
                <h2>Olá, {userName}!</h2>
                <p>
                    A administração selecionou o melhor plano para o seu perfil. Para liberar o acesso completo a todas as ferramentas, basta concluir a ativação abaixo.
                </p>
                <div className={styles.infoBox}>
                    <AlertCircle size={20} />
                    <span>Seu acesso será liberado instantaneamente após a confirmação do pagamento.</span>
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleCheckout} icon={CreditCard} size="lg" fullWidth>
                        Ir para Pagamento
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentRequiredModal;
