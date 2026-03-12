'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Menu, Phone, Video, MoreVertical, Paperclip, Smile, Mic, Send } from 'lucide-react';
import styles from './IPhoneShowcase.module.css';

const allMessages = [
    { sender: 'user', text: 'Reservo o 07', time: '14:20', type: 'incoming' },
    { sender: 'bot', text: 'Numero 07 reservado com sucesso para Patrick!\n\nValor: R$ 10,00\nPIX: pix@rifaatt.com', time: '14:20', type: 'outgoing' },
    { sender: 'user', text: 'lista', time: '14:21', type: 'incoming' },
    { sender: 'bot', text: 'RIFA DO IPHONE 15 PRO\n\n01. Disponivel\n02. Disponivel\n03. Patrick [RESERVADO]\n04. Disponivel\n05. Disponivel', time: '14:21', type: 'outgoing' },
    { sender: 'user', text: 'Reservo o 15', time: '14:22', type: 'incoming' },
    { sender: 'bot', text: 'Numero 15 reservado com sucesso para Maria!\n\nValor: R$ 10,00', time: '14:22', type: 'outgoing' },
    { sender: 'user', text: 'disponivel', time: '14:23', type: 'incoming' },
    { sender: 'bot', text: 'Numeros disponiveis: 08, 09, 10, 11, 12...', time: '14:23', type: 'outgoing' },
    { sender: 'user', text: 'Paguei o 15', time: '14:24', type: 'incoming' },
    { sender: 'bot', text: 'Pagamento confirmado para o numero 15! ✅', time: '14:24', type: 'outgoing' },
];

const IPhoneShowcase = () => {
    const [visibleMessages, setVisibleMessages] = useState(allMessages.slice(0, 5));
    const [messageIndex, setMessageIndex] = useState(5);
    const chatRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleMessages(prev => {
                const nextMsg = allMessages[messageIndex % allMessages.length];
                setMessageIndex(prevIdx => prevIdx + 1);
                const newList = [...prev, nextMsg];
                if (newList.length > 10) newList.shift();
                return newList;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [messageIndex]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [visibleMessages]);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.title}
                    >
                        Sua rifa no <span className={styles.highlight}>Piloto Automatico</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={styles.description}
                    >
                        O robo gerencia as reservas 24 horas por dia.
                        Sem erros humanos, sem demora e com total transparencia.
                    </motion.p>

                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>✓</div>
                            <div>
                                <h4>Confirmacao Instantanea</h4>
                                <p>O robo responde imediatamente a cada comando.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>≣</div>
                            <div>
                                <h4>Listagem Clara</h4>
                                <p>Status atualizado em tempo real para todos no grupo.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.iphoneWrapper}>
                    <div className={styles.iphoneBody}>
                        <div className={styles.iphoneSpeaker} />
                        <div className={styles.iphoneScreen}>
                            {/* WhatsApp Header */}
                            <div className={styles.waHeader}>
                                <div className={styles.waHeaderLeft}>
                                    <div className={styles.avatar}>RB</div>
                                    <div className={styles.waInfo}>
                                        <span className={styles.waName}>Rifa Beneficente</span>
                                        <span className={styles.waStatus}>online</span>
                                    </div>
                                </div>
                                <div className={styles.waHeaderActions}>
                                    <Video size={18} />
                                    <Phone size={18} />
                                    <MoreVertical size={18} />
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className={styles.waChat} ref={chatRef}>
                                <AnimatePresence initial={false}>
                                    {visibleMessages.map((msg, i) => (
                                        <motion.div
                                            key={`${msg.text}-${i}`}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4 }}
                                            className={msg.type === 'incoming' ? styles.msgIncoming : styles.msgOutgoing}
                                        >
                                            <div className={styles.msgContent}>
                                                {msg.text.split('\n').map((line, li) => (
                                                    <p key={li}>{line}</p>
                                                ))}
                                            </div>
                                            <div className={styles.msgMeta}>
                                                <span>{msg.time}</span>
                                                {msg.type === 'outgoing' && <CheckCheck size={12} className={styles.waCheck} />}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Chat Input */}
                            <div className={styles.waFooter}>
                                <div className={styles.waInputArea}>
                                    <Smile size={20} color="#667781" />
                                    <div className={styles.waInputPlaceholder}>Mensagem</div>
                                    <Paperclip size={20} color="#667781" />
                                </div>
                                <div className={styles.waMic}>
                                    <Mic size={20} color="white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IPhoneShowcase;
