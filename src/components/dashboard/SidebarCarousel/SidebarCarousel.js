'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Link from 'next/link';
import styles from './SidebarCarousel.module.css';

const slides = [
    {
        id: 'scale',
        title: 'Escala sua Operação',
        description: 'Adicione mais instâncias e grupos para aumentar seu alcance e faturamento.',
        icon: '🚀',
        buttonText: 'Expandir Plano',
        buttonLink: '/checkout',
        variant: 'outline'
    },
    {
        id: 'custom',
        title: 'Plano Personalizado',
        description: 'Instâncias, grupos e suporte sob medida para sua operação. Fale com um consultor.',
        icon: <Star size={24} />,
        buttonText: 'Consultar Preços',
        isWhatsApp: true,
        variant: 'primary'
    }
];

const SidebarCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const handleContact = () => {
        const phone = '5581992106048';
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre planos personalizados para o Rifaatt.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const nextSlide = () => setCurrent(prev => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);

    return (
        <div className={styles.carouselContainer}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className={styles.slideWrapper}
                >
                    <Card className={styles.slideCard}>
                        <div className={styles.iconBox}>
                            {typeof slides[current].icon === 'string' ? (
                                <span className={styles.emoji}>{slides[current].icon}</span>
                            ) : (
                                <div className={styles.iconIcon}>{slides[current].icon}</div>
                            )}
                        </div>
                        
                        <h4>{slides[current].title}</h4>
                        <p>{slides[current].description}</p>

                        {slides[current].isWhatsApp ? (
                            <Button 
                                variant={slides[current].variant} 
                                fullWidth 
                                onClick={handleContact}
                                icon={MessageCircle}
                            >
                                {slides[current].buttonText}
                            </Button>
                        ) : (
                            <Link href={slides[current].buttonLink} className={styles.link}>
                                <Button variant={slides[current].variant} fullWidth>
                                    {slides[current].buttonText}
                                </Button>
                            </Link>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>

            <div className={styles.controls}>
                <div className={styles.dots}>
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            className={clsx(styles.dot, current === idx && styles.activeDot)}
                            onClick={() => setCurrent(idx)}
                        />
                    ))}
                </div>
                <div className={styles.arrows}>
                    <button onClick={prevSlide} className={styles.arrowBtn}><ChevronLeft size={16} /></button>
                    <button onClick={nextSlide} className={styles.arrowBtn}><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default SidebarCarousel;

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
