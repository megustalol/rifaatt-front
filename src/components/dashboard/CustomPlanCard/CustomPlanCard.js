'use client';

import React from 'react';
import { MessageCircle, Star } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import styles from './CustomPlanCard.module.css';

const CustomPlanCard = () => {
    const handleContact = () => {
        const phone = '5581992106048';
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre planos personalizados para o Rifaatt.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <Card className={styles.container}>
            <div className={styles.iconWrapper}>
                <Star size={24} className={styles.starIcon} />
            </div>
            
            <div className={styles.content}>
                <h4 className={styles.title}>Plano Personalizado</h4>
                <p className={styles.description}>
                    Precisa de mais instâncias ou recursos sob medida? Fale agora com um consultor.
                </p>
                
                <Button 
                    variant="primary" 
                    fullWidth 
                    className={styles.contactBtn}
                    onClick={handleContact}
                >
                    <MessageCircle size={18} className={styles.btnIcon} />
                    Consultar Preços
                </Button>
            </div>
        </Card>
    );
};

export default CustomPlanCard;
