'use client';

import React from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { Rocket, ShieldAlert, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './UpgradeModal.module.css';

const UpgradeModal = ({ isOpen, onClose, featureName, limit }) => {
    const router = useRouter();

    const handleUpgrade = () => {
        onClose();
        router.push('/checkout');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showClose={true}
            title=""
        >
            <div className={styles.container}>
                <div className={styles.iconWrapper}>
                    <div className={styles.rocketIcon}>
                        <Rocket size={40} />
                    </div>
                    <div className={styles.alertIcon}>
                        <ShieldAlert size={20} />
                    </div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>Limite Atingido!</h2>
                    <p className={styles.description}>
                        Seu plano atual permite até <strong>{limit} {featureName}</strong>. 
                        Para continuar escalando sua operação e adicionar mais, você precisa de um plano superior.
                    </p>
                </div>

                <div className={styles.actions}>
                    <Button 
                        fullWidth 
                        onClick={handleUpgrade}
                        icon={ArrowRight}
                        className={styles.upgradeBtn}
                    >
                        Fazer Upgrade Agora
                    </Button>
                    <button className={styles.maybeLater} onClick={onClose}>
                        Talvez depois
                    </button>
                </div>

                <div className={styles.benefits}>
                    <p>Ao fazer o upgrade você libera:</p>
                    <ul>
                        <li>Mais instâncias simultâneas</li>
                        <li>Grupos ilimitados (conforme o plano)</li>
                        <li>Suporte prioritário 24/7</li>
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

export default UpgradeModal;
