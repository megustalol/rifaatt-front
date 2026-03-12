'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    ArrowLeft,
    QrCode,
    Copy,
    Check,
    ShieldCheck,
    CreditCard,
    Zap
} from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import styles from './page.module.css';
import Image from 'next/image';
import clsx from 'clsx';

const PLANS = {
    basic: {
        name: 'Iniciante',
        price: '0',
        features: ['1 Grupo Ativo', '100 Dezenas por mês', 'Suporte via E-mail']
    },
    pro: {
        name: 'Profissional',
        price: '49',
        features: ['5 Grupos Ativos', 'Dezenas Ilimitadas', 'Suporte Prioritário', 'Relatórios de Vendas']
    },
    elite: {
        name: 'Elite',
        price: '99',
        features: ['Grupos Ilimitados', 'Dezenas Ilimitadas', 'Suporte VIP 24/7', 'API de Integração', 'Domínio Personalizado']
    }
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialPlan = searchParams.get('plan') || 'pro';

    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState(1); // 1: Confirm Plan, 2: Payment

    const planInfo = PLANS[selectedPlan] || PLANS.pro;

    const handleCopyPix = () => {
        navigator.clipboard.writeText('00020126580014br.gov.bcb.pix01362e49c824-3f2d-4e92-9c1a-1a2b3c4d5e6f520400005303986540549.005802BR5913RIFAATT SAAS6009SAO PAULO62070503***6304E2A1');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Voltar
                </button>
                <div className={styles.logo}>
                    <Image src="/logogrande.png" alt="Rifaatt" width={160} height={45} priority className={styles.logoImg} />
                </div>
                <ThemeToggle />
            </header>

            <main className={styles.main}>
                <div className={styles.checkoutGrid}>
                    {/* Left: Plan Summary/Selection */}
                    <section className={styles.selectionSection}>
                        <h1 className={styles.title}>Confirme seu plano</h1>
                        <p className={styles.subtitle}>Você pode alterar seu plano antes de prosseguir com o pagamento.</p>

                        <div className={styles.planOptions}>
                            {Object.entries(PLANS).map(([id, plan]) => (
                                <div
                                    key={id}
                                    className={clsx(styles.planOption, selectedPlan === id && styles.selected)}
                                    onClick={() => setSelectedPlan(id)}
                                >
                                    <div className={styles.planRadio}>
                                        <div className={styles.radioInner} />
                                    </div>
                                    <div className={styles.planDetails}>
                                        <span className={styles.optionName}>{plan.name}</span>
                                        <span className={styles.optionPrice}>R$ {plan.price}/mês</span>
                                    </div>
                                    {id === 'pro' && <span className={styles.badge}>Recomendado</span>}
                                </div>
                            ))}
                        </div>

                        <div className={styles.featureList}>
                            <h3>O que está incluso no plano {planInfo.name}:</h3>
                            {planInfo.features.map((feature, i) => (
                                <div key={i} className={styles.featureItem}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Right: Payment Sidebar */}
                    <aside className={styles.paymentSection}>
                        <Card className={styles.paymentCard}>
                            <div className={styles.orderSummary}>
                                <div className={styles.summaryRow}>
                                    <span>Plano Selecionado</span>
                                    <span>{planInfo.name}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>R$ {planInfo.price},00</span>
                                </div>
                                <div className={styles.divider} />
                                <div className={clsx(styles.summaryRow, styles.total)}>
                                    <span>Total</span>
                                    <span>R$ {planInfo.price},00</span>
                                </div>
                            </div>

                            {planInfo.price === "0" ? (
                                <div className={styles.freePlanNotice}>
                                    <Zap size={32} className={styles.zapIcon} />
                                    <h3>Plano Gratuito Ativado</h3>
                                    <p>Você será redirecionado para o dashboard em instantes.</p>
                                    <Button fullWidth onClick={() => router.push('/dashboard')}>
                                        Ir para o Dashboard
                                    </Button>
                                </div>
                            ) : (
                                <div className={styles.pixFlow}>
                                    <div className={styles.pixHeader}>
                                        <QrCode size={24} />
                                        <span>Pagamento via PIX</span>
                                    </div>

                                    <div className={styles.qrPlaceholder}>
                                        {/* In a real app, generate actual QR here */}
                                        <div className={styles.mockQr}>
                                            <QrCode size={160} strokeWidth={1} />
                                        </div>
                                    </div>

                                    <p className={styles.pixInstructions}>
                                        Escaneie o QR Code acima ou copie a chave PIX abaixo para pagar.
                                    </p>

                                    <div className={styles.pixCopyArea}>
                                        <div className={styles.pixKey}>
                                            00020126580014br.gov.bcb.pix01362e49c824...
                                        </div>
                                        <button onClick={handleCopyPix} className={styles.copyBtn}>
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>

                                    <div className={styles.secureNotice}>
                                        <ShieldCheck size={16} />
                                        Pagamento 100% Seguro via Mercado Pago
                                    </div>
                                </div>
                            )}
                        </Card>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)'
            }}>
                Carregando checkout...
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}

