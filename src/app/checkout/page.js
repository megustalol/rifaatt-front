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
import api from '@/services/api';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(searchParams.get('plan'));
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/plans');
            const activePlans = res.data.filter(p => p.status === 'active');
            setPlans(activePlans);
            if (!selectedPlanId && activePlans.length > 0) {
                setSelectedPlanId(activePlans[0].id);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

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
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={clsx(styles.planOption, selectedPlanId === plan.id && styles.selected)}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                >
                                    <div className={styles.planRadio}>
                                        <div className={styles.radioInner} />
                                    </div>
                                    <div className={styles.planDetails}>
                                        <span className={styles.optionName}>{plan.name}</span>
                                        <span className={styles.optionPrice}>R$ {plan.price}/mês</span>
                                    </div>
                                    {plan.name === 'Profissional' && <span className={styles.badge}>Recomendado</span>}
                                </div>
                            ))}
                        </div>

                        {selectedPlan && (
                            <div className={styles.featureList}>
                                <h3>O que está incluso no plano {selectedPlan.name}:</h3>
                                <div className={styles.featureItem}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                    {selectedPlan.instanceLimit} {selectedPlan.instanceLimit === 1 ? 'Instância' : 'Instâncias'}
                                </div>
                                <div className={styles.featureItem}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                    {selectedPlan.groupLimit} {selectedPlan.groupLimit === 1 ? 'Grupo Ativo' : 'Grupos Ativos'}
                                </div>
                                {(selectedPlan.features || []).map((feature, i) => (
                                    <div key={i} className={clsx(styles.featureItem, !feature.active && styles.disabled)}>
                                        <CheckCircle2 size={18} className={styles.checkIcon} />
                                        {feature.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Right: Payment Sidebar */}
                    <aside className={styles.paymentSection}>
                        <Card className={styles.paymentCard}>
                            {selectedPlan && (
                                <div className={styles.orderSummary}>
                                    <div className={styles.summaryRow}>
                                        <span>Plano Selecionado</span>
                                        <span>{selectedPlan.name}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal</span>
                                        <span>R$ {selectedPlan.price}</span>
                                    </div>
                                    <div className={styles.divider} />
                                    <div className={clsx(styles.summaryRow, styles.total)}>
                                        <span>Total</span>
                                        <span>R$ {selectedPlan.price}</span>
                                    </div>
                                </div>
                            )}

                            {selectedPlan && parseFloat(selectedPlan.price) === 0 ? (
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

