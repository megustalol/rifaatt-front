'use client';

import React from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { Rocket, ShieldAlert, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './UpgradeModal.module.css';

const UpgradeModal = ({ isOpen, onClose, featureName, limit, isLocked = false }) => {
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
            showClose={!isLocked}
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
                    <h2 className={styles.title}>{isLocked ? 'Funcionalidade Bloqueada' : 'Limite Atingido!'}</h2>
                    <p className={styles.description}>
                        {isLocked ? (
                            <>Sua conta está no <strong>Plano Gratuito</strong> e não possui acesso a esta funcionalidade. Assine um plano para começar a usar.</>
                        ) : (
                            <>Seu plano atual permite até <strong>{limit} {featureName}</strong>. Para continuar escalando sua operação e adicionar mais, você precisa de um plano superior.</>
                        )}
                    </p>
                </div>

                <div className={styles.actions}>
                    <Button 
                        fullWidth 
                        onClick={handleUpgrade}
                        icon={ArrowRight}
                        className={styles.upgradeBtn}
                    >
                        {isLocked ? 'Assinar um Plano' : 'Fazer Upgrade Agora'}
                    </Button>
                    {!isLocked && (
                        <button className={styles.maybeLater} onClick={onClose}>
                            Talvez depois
                        </button>
                    )}
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
