'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, Smartphone } from 'lucide-react';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import Image from 'next/image';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'login';
    const plan = searchParams.get('plan');

    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(null); // 'master' or 'organizer'
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleToggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            let success = false;
            let role = 'organizer';
            if (mode === 'login') {
                success = await login(email, password);
                if (success && email === 'admin@rifaatt.com') role = 'master';
            } else {
                const name = formData.get('name');
                const phone = formData.get('phone');
                success = await register({ name, phone, email, password });
            }

            if (success) {
                setRedirecting(role);
                // Delay actual redirect for animation
                setTimeout(() => {
                    if (plan) {
                        router.push(`/checkout?plan=${plan}`);
                    } else if (role === 'master') {
                        router.push('/master');
                    } else {
                        router.push('/dashboard');
                    }
                }, 1500);
            } else {
                setError('Credenciais inválidas. Tente novamente.');
            }
        } catch (err) {
            setError('Ocorreu um erro no servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {redirecting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={clsx(styles.transitionOverlay, redirecting === 'master' ? styles.masterTransition : styles.userTransition)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={styles.transitionContent}
                        >
                            <div className={styles.transitionLogo}>
                                <Image src="/logomenor.png" alt="Logo" width={80} height={80} />
                            </div>
                            <h2>{redirecting === 'master' ? 'Acessando Central Master' : 'Preparando seu Dashboard'}</h2>
                            <div className={styles.loaderLine}>
                                <motion.div
                                    className={styles.loaderProgress}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

            {/* Right Side: Form */}
            <div className={styles.formSection}>
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={styles.formCard}
                >
                    <div className={styles.cardHeader}>
                        <h2>{mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
                        <p>{mode === 'login' ? 'Insira seus dados para entrar' : 'Comece a automatizar suas rifas hoje'}</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <AnimatePresence mode="popLayout">
                            {mode === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Input
                                        label="Nome Completo"
                                        name="name"
                                        icon={User}
                                        className={styles.field}
                                        required
                                    />
                                    <Input
                                        label="WhatsApp"
                                        name="phone"
                                        icon={Smartphone}
                                        className={styles.field}
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            icon={Mail}
                            className={styles.field}
                            required
                        />

                        <Input
                            label="Senha"
                            name="password"
                            type="password"
                            icon={Lock}
                            className={styles.field}
                            required
                        />

                        {mode === 'login' && (
                            <a href="#" className={styles.forgotPassword}>Esqueci minha senha</a>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            className={clsx(error && styles.shake)}
                        >
                            {mode === 'login' ? 'Entrar na Plataforma' : 'Criar minha conta'}
                        </Button>

                        {error && <p className={styles.errorText}>{error}</p>}
                    </form>


                    <p className={styles.switchMode}>
                        {mode === 'login' ? 'Não tem uma conta?' : 'Já possui uma conta?'}
                        <button onClick={handleToggleMode}>
                            {mode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Carregando...
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
