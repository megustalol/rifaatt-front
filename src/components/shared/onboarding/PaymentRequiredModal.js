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
                    Seu plano foi selecionado pela administração. Para que você possa começar a utilizar todas as funcionalidades, é necessário concluir o pagamento da primeira mensalidade.
                </p>
                <div className={styles.infoBox}>
                    <AlertCircle size={20} />
                    <span>Ao clicar no botão abaixo, você será redirecionado para a nossa página de checkout seguro.</span>
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
