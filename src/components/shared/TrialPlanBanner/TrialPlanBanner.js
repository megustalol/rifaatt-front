'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../FreePlanBanner/FreePlanBanner.module.css'; // Reusing base styles

const TrialPlanBanner = ({ expiryDate, user }) => {
    const router = useRouter();
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        if (!expiryDate) return;
        
        const calculateDays = () => {
            const now = new Date();
            const expiry = new Date(expiryDate);
            const diffTime = expiry - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysLeft(diffDays > 0 ? diffDays : 0);
        };

        calculateDays();
        const interval = setInterval(calculateDays, 1000 * 60 * 60); // Update every hour
        return () => clearInterval(interval);
    }, [expiryDate]);

    const formattedDate = new Date(expiryDate).toLocaleDateString('pt-BR');

    const isWarning = daysLeft <= 5;

    return (
        <div className={clsx(styles.banner, isWarning && styles.warningBanner)} 
             style={!isWarning ? { backgroundColor: 'rgba(56, 139, 255, 0.1)', borderBottom: '1px solid rgba(56, 139, 255, 0.2)' } : {}}>
            <div className={styles.content}>
                <div className={clsx(styles.iconWrapper, isWarning && styles.warningIcon)} 
                     style={!isWarning ? { backgroundColor: '#2B7FFF' } : {}}>
                    <Clock size={18} />
                </div>
                <p className={styles.text} style={{ color: isWarning ? '#FFF' : '#E2E8F0' }}>
                    {isWarning ? (
                        <>Sua licença <strong>expira em breve!</strong> Restam apenas <strong>{daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</strong> no plano <strong>{user?.Plan?.name || 'Premium'}</strong>.</>
                    ) : (
                        <>Você está no <strong>Período de Teste</strong> do plano <strong>{user?.Plan?.name || 'Premium'}</strong>. Seu acesso expira em <strong>{formattedDate}</strong> ({daysLeft} {daysLeft === 1 ? 'dia restante' : 'dias restantes'}).</>
                    )}
                </p>
            </div>
            <button 
                className={clsx(styles.button, isWarning && styles.warningButton)} 
                onClick={() => router.push('/checkout')}
                style={!isWarning ? { backgroundColor: '#2B7FFF', color: 'white' } : {}}
            >
                {isWarning ? 'Renovar Agora' : 'Assinar Agora'}
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

import clsx from 'clsx';

export default TrialPlanBanner;
