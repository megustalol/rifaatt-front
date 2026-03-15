'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import styles from './page.module.css';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const handleWhatsAppRedirect = () => {
        const phone = '5581992106048';
        const message = encodeURIComponent('Olá! Esqueci minha senha no Rifaatt e gostaria de recuperá-la.');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <div className={styles.container}>
            <div className={styles.themeToggleWrapper}>
                <ThemeToggle />
            </div>

            {/* Left Side: Branding */}
            <div className={styles.brandingSection}>
                <div className={styles.gradientBg} />
                <div className={styles.brandingContent}>
                    <div className={styles.logo}>
                        <Image
                            src="/logogrande.png"
                            alt="Rifaatt Logo"
                            width={280}
                            height={80}
                            className={styles.logoImgLarge}
                            priority
                        />
                    </div>
                    <p className={styles.tagline}>A revolução na gestão <br />de rifas pelo WhatsApp.</p>
                </div>
            </div>

            {/* Right Side: Content */}
            <div className={styles.formSection}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.formCard}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <HelpCircle size={40} className={styles.headerIcon} />
                        </div>
                        <h2>Esqueceu sua senha?</h2>
                        <p>Não se preocupe! Por questões de segurança, a recuperação de senha é feita diretamente com nosso suporte master.</p>
                    </div>

                    <div className={styles.supportInfo}>
                        <div className={styles.supportDetails}>
                            <span className={styles.supportLabel}>Falar com Administrador</span>
                            <span className={styles.supportNumber}>(81) 99210-6048</span>
                        </div>
                        
                        <Button
                            fullWidth
                            size="lg"
                            className={styles.whatsappBtn}
                            onClick={handleWhatsAppRedirect}
                        >
                            <MessageCircle size={20} className={styles.btnIcon} />
                            Entrar em contato via WhatsApp
                        </Button>
                    </div>

                    <button 
                        className={styles.backLink}
                        onClick={() => router.push('/login')}
                    >
                        <ArrowLeft size={16} />
                        Voltar para o login
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
