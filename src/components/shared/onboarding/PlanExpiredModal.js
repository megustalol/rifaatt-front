'use client';

import React from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { AlertCircle, CreditCard } from 'lucide-react';
import styles from './OnboardingModal.module.css';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const PlanExpiredModal = ({ isOpen, onClose }) => {
    const router = useRouter();

    const handleRenew = () => {
        router.push('/checkout');
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {}} // User shouldn't be able to just close it easily if they are blocked
            title="Sua licença expirou"
            size="md"
            showClose={false}
        >
            <div className={styles.container}>
                <div className={clsx(styles.iconWrapperTrial, styles.expiredIcon)}>
                    <AlertCircle size={48} />
                </div>
                <h2>Acesso Suspenso</h2>
                <p>
                    Seu período de uso do <strong>Rifaatt</strong> chegou ao fim. Para continuar gerenciando seus grupos e automatizando suas rifas, é necessário realizar a renovação.
                </p>

                <div className={styles.highlightBox} style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span>Seus dados continuam salvos, mas os robôs já não estão mais ativos nos grupos.</span>
                </div>
                
                <div className={styles.actions}>
                    <Button onClick={handleRenew} size="lg" icon={CreditCard} fullWidth>
                        Renovar Agora
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PlanExpiredModal;
