'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
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
import { useAuth } from '@/context/AuthContext';

const CheckoutContent = () => {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(searchParams.get('plan'));
    const [loading, setLoading] = useState(true);
    const [generatingPayment, setGeneratingPayment] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [document, setDocument] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('PENDING');

    const fetchPlans = useCallback(async () => {
        try {
            const res = await api.get('/plans');
            const activePlans = res.data.filter(p => {
                if (p.status !== 'active') return false;
                const isTrial = !!user?.planExpiresAt;
                if (isTrial) return true;
                return p.id !== user?.planId;
            });
            setPlans(activePlans);
            
            // Stable update: only set if we don't have one and not currently updating
            setSelectedPlanId(prev => (prev || (activePlans.length > 0 ? activePlans[0].id : null)));
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.planId, user?.planExpiresAt]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    useEffect(() => {
        let interval;
        if (paymentData?.paymentId && paymentStatus === 'PENDING') {
            interval = setInterval(async () => {
                try {
                    const res = await api.get(`/payments/status/${paymentData.paymentId}`);
                    if (res.data.status === 'RECEIVED' || res.data.status === 'CONFIRMED') {
                        setPaymentStatus('CONFIRMED');
                        clearInterval(interval);
                        setTimeout(() => {
                            router.push('/dashboard?success=plan_active');
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error polling status:', error);
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [paymentData, paymentStatus, router]);

    const handleGeneratePayment = async () => {
        if (!document || document.length < 11) {
            setError('CPF ou CNPJ válido é obrigatório.');
            return;
        }

        setGeneratingPayment(true);
        setError('');
        try {
            const res = await api.post('/payments/checkout', {
                planId: selectedPlanId,
                document: document.replace(/\D/g, '')
            });
            setPaymentData(res.data);
        } catch (error) {
            console.error('Error generating payment:', error);
            setError(error.response?.data?.error || 'Erro ao gerar pagamento. Tente novamente.');
        } finally {
            setGeneratingPayment(false);
        }
    };

    const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

    const handleCopyPix = () => {
        if (paymentData?.payload) {
            navigator.clipboard.writeText(paymentData.payload);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
            Carregando checkout...
        </div>
    );

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
                    <section className={styles.selectionSection}>
                        <h1 className={styles.title}>Confirme seu plano</h1>
                        <p className={styles.subtitle}>Escolha o plano ideal para seu negócio e automatize suas vendas.</p>

                        <div className={styles.planOptions}>
                            {plans.length === 0 ? (
                                <div className={styles.noPlansAvailable}>
                                    <div className={styles.noPlansIcon}>
                                        <Zap size={32} />
                                    </div>
                                    <h3>Nenhum plano disponível no momento</h3>
                                    <p>Não encontramos planos públicos ativos. Para uma solução personalizada, entre em contato conosco.</p>
                                    <Button 
                                        variant="secondary" 
                                        className={styles.contactBtn}
                                        onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                                    >
                                        Contato para Planos Personalizados
                                    </Button>
                                </div>
                            ) : (
                                plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={clsx(styles.planOption, selectedPlanId === plan.id && styles.selected)}
                                        onClick={() => !paymentData && setSelectedPlanId(plan.id)}
                                    >
                                        <div className={styles.planRadio}>
                                            <div className={styles.radioInner} />
                                        </div>
                                        <div className={styles.planDetails}>
                                            <span className={styles.optionName}>{plan.name}</span>
                                            <span className={styles.optionPrice}>R$ {plan.price}/mês</span>
                                        </div>
                                        {plan.name?.toLowerCase().includes('profissional') && <span className={styles.badge}>Recomendado</span>}
                                    </div>
                                ))
                            )}
                        </div>

                        {!paymentData && (
                            <div className={styles.documentInputSection}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>CPF ou CNPJ para emissão</label>
                                    <input
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className={styles.inputField}
                                        value={document}
                                        onChange={(e) => setDocument(e.target.value)}
                                    />
                                    {error && <span className={styles.inputError}>{error}</span>}
                                </div>
                                <Button
                                    fullWidth
                                    className={styles.generateBtn}
                                    style={{ marginTop: '20px' }}
                                    onClick={handleGeneratePayment}
                                    loading={generatingPayment}
                                >
                                    Gerar Pagamento PIX
                                </Button>
                            </div>
                        )}

                        {selectedPlan && (
                            <div className={styles.featureList} style={{ marginTop: '30px' }}>
                                <h3>O que está incluso no plano {selectedPlan.name}:</h3>
                                <div className={styles.featureItem}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                    {selectedPlan.instanceLimit} {selectedPlan.instanceLimit === 1 ? 'Instância' : 'Instâncias'}
                                </div>
                                <div className={styles.featureItem}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                    {selectedPlan.groupLimit} {selectedPlan.groupLimit === 1 ? 'Grupo Ativo' : 'Grupos Ativos'}
                                </div>
                            </div>
                        )}
                    </section>

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

                            {paymentData ? (
                                <div className={styles.pixFlow}>
                                    {paymentStatus === 'CONFIRMED' ? (
                                        <div className={styles.successNotice}>
                                            <CheckCircle2 size={48} className={styles.successIcon} />
                                            <h3>Pagamento Confirmado!</h3>
                                            <p>Seu plano foi ativado. Redirecionando...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.pixHeader}>
                                                <Zap size={24} />
                                                <span>Pagamento via PIX</span>
                                            </div>

                                            <div className={styles.qrPlaceholder}>
                                                <img
                                                    src={`data:image/png;base64,${paymentData.qrCode}`}
                                                    alt="QR Code PIX"
                                                    style={{ width: '180px', height: '180px' }}
                                                />
                                            </div>

                                            <p className={styles.pixInstructions}>
                                                Escaneie o QR Code acima ou copie a chave PIX abaixo para pagar.
                                            </p>

                                            <div className={styles.pixCopyArea}>
                                                <div className={styles.pixKey}>
                                                    {paymentData.payload}
                                                </div>
                                                <button onClick={handleCopyPix} className={styles.copyBtn}>
                                                    {copied ? (
                                                        <>
                                                            <Check size={18} />
                                                            <span>Copiado!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={18} />
                                                            <span>Copiar Código PIX</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className={styles.secureNotice}>
                                                <ShieldCheck size={16} />
                                                Pagamento processado via Asaas
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.waitingNotice}>
                                    <p>Selecione um plano e informe seu CPF para gerar o pagamento.</p>
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

