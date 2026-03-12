'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Zap,
  QrCode,
  ShieldCheck,
  Users,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import styles from './page.module.css';
import Image from 'next/image';
import clsx from 'clsx';
import { QRScanVisual, ConfigVisual, AutopilotVisual } from '@/components/landing/StepVisuals/StepVisuals';
import IPhoneShowcase from '@/components/landing/IPhoneShowcase/IPhoneShowcase';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const metricsRef = useRef(null);
  const [plans, setPlans] = React.useState([]);

  useEffect(() => {
    fetchPlans();
    
    // GSAP ScrollTrigger for "How it works" cards
    const cards = gsap.utils.toArray(`.${styles.stepCard}`);
    const sections = gsap.utils.toArray(`section:not(.${styles.hero})`);

    // Slide-in effect for sections
    sections.forEach((section, i) => {
      gsap.fromTo(section,
        {
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50,
          y: 30
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    cards.forEach((card, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(card,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }
      );

      // Stagger children
      tl.fromTo(card.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        },
        '-=0.4'
      );
    });

    // Animate Feature cards staggered
    gsap.fromTo(`.${styles.featureCard}`,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: `.${styles.featuresGrid}`,
          start: 'top 80%'
        }
      }
    );
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data.filter(p => p.isPublic && p.status === 'active'));
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={clsx(styles.navHeader, isMenuOpen && styles.menuOpen)}>
        <div className={styles.logo}>
          <Image
            src="/logogrande.png"
            alt="Rifaatt Logo"
            width={140}
            height={40}
            className={styles.logoImg}
            priority
          />
        </div>

        <nav className={styles.desktopNav}>
          <a href="#features">Funcionalidades</a>
          <a href="#how-it-works">Como funciona</a>
          <a href="#pricing">Preços</a>
        </nav>

        <div className={styles.navActions}>
          <div className={styles.desktopOnlyActions}>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="white">Entrar</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button>Começar Agora</Button>
            </Link>
          </div>
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={clsx(styles.mobileNavOverlay, isMenuOpen && styles.mobileNavVisible)}>
          <div className={styles.mobileNavLinks}>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Funcionalidades</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>Como funciona</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Preços</a>
            
            <div className={styles.mobileMenuFooter}>
              <ThemeToggle />
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="white" fullWidth>Entrar</Button>
              </Link>
              <Link href="/login?tab=register" onClick={() => setIsMenuOpen(false)}>
                <Button fullWidth>Começar Agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className={styles.videoBackground}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay} />

          <div className={styles.textSection}>
            <div className={styles.gridOverlay} />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroContentBox}
            >
              <div className={styles.badge}>
                🚀 Novo: Gerenciamento Multi-grupos
              </div>

              <h1 className={styles.headline}>
                Chega de anotações manuais. <br />
                <span className={styles.highlight}>Sua rifa no automático.</span>
              </h1>

              <p className={styles.subheadline}>
                A Rifaatt automatiza a reserva e o pagamento de dezenas direto no seu WhatsApp.
                Seguro, rápido e sem erros.
              </p>

              <div className={styles.heroActions}>
                <Link href="/login?tab=register">
                  <Button size="lg">Começar grátis</Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" size="lg" icon={Zap}>Ver demonstração</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="demo" className={styles.demoContainer}>
          <div className={styles.demoHeader}>
            <h2 className={styles.demoTitle}>Veja a mágica acontecendo</h2>
            <p className={styles.demoSubtitle}>
              Simulamos abaixo uma conversa real no WhatsApp. Escolha um número, envie e veja o robô responder instantaneamente.
            </p>
          </div>
          <IPhoneShowcase />
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Planos simples e transparentes</h2>
            <p className={styles.sectionSubtitle}>Escolha o plano que melhor se adapta ao momento da sua organização.</p>
          </div>

          <div className={styles.pricingGrid}>
            {plans.length === 0 ? (
              // Fallback skeleton or message
              <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: 'var(--text-secondary)' }}>
                Carregando planos...
              </div>
            ) : (
              plans.map((plan, index) => (
                <PricingCard
                  key={plan.id}
                  id={plan.id}
                  name={plan.name}
                  price={plan.price}
                  featured={index === 1} // Middle one featured by default
                  features={plan.features || []}
                  instanceLimit={plan.instanceLimit}
                  groupLimit={plan.groupLimit}
                />
              ))
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tudo que você precisa</h2>
            <p className={styles.sectionSubtitle}>Funcionalidades pensadas para quem organiza rifas todos os dias.</p>
          </div>

          <div className={styles.featuresGrid}>
            <FeatureCard
              icon={LayoutDashboard}
              title="Quadro em Tempo Real"
              desc="Visualize dezenas livres, reservadas e pagas em um grid 10x10 interativo."
            />
            <FeatureCard
              icon={Smartphone}
              title="Reserva via WhatsApp"
              desc="O robô entende as dezenas enviadas e faz a reserva instantaneamente."
            />
            <FeatureCard
              icon={QrCode}
              title="QR Code PIX Instantâneo"
              desc="Gere cobranças PIX automáticas para cada reserva direto na conversa."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Zero Dupla Reserva"
              desc="Sistema inteligente que impede que dois usuários reservem o mesmo número."
            />
            <FeatureCard
              icon={Users}
              title="Gestão de Grupos"
              desc="Controle múltiplas rifas em grupos diferentes de um único painel."
            />
            <FeatureCard
              icon={Zap}
              title="Dashboard Completo"
              desc="Acompanhe estatísticas de vendas, usuários ativos e saldo total."
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className={styles.sectionAlt}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Simples como deve ser</h2>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <QRScanVisual />
              <div className={styles.stepNumber}>01</div>
              <h3>Conecte seu Whats</h3>
              <p>Escaneie o QR Code e vincule seu número à plataforma em segundos.</p>
            </div>
            <div className={styles.stepCard}>
              <ConfigVisual />
              <div className={styles.stepNumber}>02</div>
              <h3>Configure a Rifa</h3>
              <p>Defina o prêmio, valor da dezena e as regras do sorteio.</p>
            </div>
            <div className={styles.stepCard}>
              <AutopilotVisual />
              <div className={styles.stepNumber}>03</div>
              <h3>Venda no Piloto Automático</h3>
              <p>Adicione o robô ao grupo e deixe ele cuidar das reservas por você.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <Image
              src="/logogrande.png"
              alt="Rifaatt Logo"
              width={120}
              height={34}
              className={styles.logoImg}
            />
          </div>
          <p>Automação inteligente para organizadores de sucesso.</p>
        </div>
        <div className={styles.footerLinks}>
          <div>
            <h4>Produto</h4>
            <a href="#">Funcionalidades</a>
            <a href="#">Preços</a>
          </div>
          <div>
            <h4>Suporte</h4>
            <a href="#">Documentação</a>
            <a href="#">Contato</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ id, name, price, features, featured, instanceLimit, groupLimit }) {
  return (
    <Card className={clsx(styles.pricingCard, featured && styles.featuredCard)}>
      {featured && <div className={styles.popularBadge}>Mais Popular</div>}
      <h3 className={styles.planName}>{name}</h3>
      <div className={styles.planPrice}>
        R$ {price} <span>/mês</span>
      </div>
      <div className={styles.planFeatures}>
        <div className={styles.featureItem}>
          <CheckCircle2 className={styles.checkIcon} size={18} />
          {instanceLimit} {instanceLimit === 1 ? 'Instância' : 'Instâncias'}
        </div>
        <div className={styles.featureItem}>
          <CheckCircle2 className={styles.checkIcon} size={18} />
          {groupLimit} {groupLimit === 1 ? 'Grupo Ativo' : 'Grupos Ativos'}
        </div>
        {features.map((feature, idx) => (
          <div key={idx} className={clsx(styles.featureItem, !feature.active && styles.disabled)}>
            {feature.active ? (
              <CheckCircle2 className={styles.checkIcon} size={18} />
            ) : (
              <Zap className={styles.disabledIcon} size={18} />
            )}
            {feature.text}
          </div>
        ))}
      </div>
      <Link href={`/login?tab=register&plan=${id}`} className={styles.pricingButton}>
        <Button variant={featured ? 'primary' : 'outline'} fullWidth>
          {parseFloat(price) === 0 ? "Começar Agora" : "Assinar Plano"}
        </Button>
      </Link>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <Card variant="glass" className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </Card>
  );
}
