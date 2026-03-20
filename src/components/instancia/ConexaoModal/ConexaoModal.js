'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { Smartphone, QrCode, Hash, Info, Loader2 } from 'lucide-react';
import styles from './ConexaoModal.module.css';

import api from '@/services/api';

const ConexaoModal = ({ isOpen, onClose, instance, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('qrcode');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [qrBase64, setQrBase64] = useState(null);
    const [pairingCode, setPairingCode] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [apiUrl, setApiUrl] = useState('https://api.uazapi.com');
    const [adminToken, setAdminToken] = useState('');
    const [currentInstance, setCurrentInstance] = useState(instance);

    useEffect(() => {
        if (isOpen) {
            if (instance) {
                setCurrentInstance(instance);
                setName(instance.name);
                startConnection(instance.id);
            } else {
                setCurrentInstance(null);
                setName('');
                setApiUrl('https://api.uazapi.com');
                setAdminToken('');
                setQrBase64(null);
                setPairingCode(null);
            }
        }
    }, [isOpen, instance]);

    const startConnection = async (id, phoneInput = null) => {
        setLoading(true);
        console.log('[START_CONN] Starting connection for ID:', id, 'Phone:', phoneInput);
        try {
            const response = await api.post(`/instances/connect/${id}`, { phone: phoneInput });
            console.log('[START_CONN] Raw Response Data:', JSON.stringify(response.data));

            const data = response.data;
            
            // Handle Uazapi nested response structure
            const qrcodeData = data.instance?.qrcode || data.base64 || data.qrcode || data.instance?.qrCode;
            const pairingCodeData = data.instance?.paircode || data.paircode || data.pairingCode || data.instance?.pairCode;

            console.log('[START_CONN] Extracted QR:', qrcodeData ? 'exists' : 'null');
            console.log('[START_CONN] Extracted Pairing:', pairingCodeData);

            if (qrcodeData) {
                setQrBase64(qrcodeData);
                setTimeLeft(60);
            }
            if (pairingCodeData) {
                setPairingCode(pairingCodeData);
            }
            startPolling(id);
        } catch (error) {
            console.error('Error connecting:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            const response = await api.post('/instances/init', { name });
            setCurrentInstance(response.data);
            startConnection(response.data.id);
        } catch (error) {
            console.error('Error creating instance:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (id) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/instances/status/${id}`);
                const data = response.data;
                const pCode = data.instance?.paircode ?? data.paircode ?? data.pairingCode ?? data.instance?.pairCode;
                console.log('[POLL] Status check:', data.instance?.status, 'PairCode:', pCode === "" ? "(empty)" : pCode);

                // Update pairing code if it arrived later
                if (pCode && pCode.length > 0) {
                    setPairingCode(pCode);
                }

                if (data.instance?.status === 'connected') {
                    clearInterval(interval);
                    onSuccess && onSuccess();
                    onClose();
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 5000);
        return () => clearInterval(interval);
    };

    useEffect(() => {
        if (qrBase64 && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [qrBase64, timeLeft]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={currentInstance ? `Conectar: ${currentInstance.name}` : 'Nova Instância'}
            size="md"
        >
            <div className={styles.container}>
                {!currentInstance ? (
                    <div className={styles.initSection}>
                        <div className={styles.infoBox}>
                            <Info size={18} />
                            <p>Configure sua instância conectando-se ao servidor central.</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Nome da Instância</label>
                            <input
                                type="text"
                                placeholder="Ex: WhatsApp Vendas"
                                className={styles.phoneInput}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <Button
                            fullWidth
                            onClick={handleCreate}
                            loading={loading}
                            disabled={!name}
                            style={{ marginTop: '1rem' }}
                        >
                            Criar e Conectar
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className={styles.tabWrapper}>
                            <button
                                className={activeTab === 'qrcode' ? styles.activeTab : ''}
                                onClick={() => setActiveTab('qrcode')}
                            >
                                <QrCode size={18} />
                                <span>QR Code</span>
                            </button>
                            <button
                                className={activeTab === 'pairing' ? styles.activeTab : ''}
                                onClick={() => setActiveTab('pairing')}
                            >
                                <Hash size={18} />
                                <span>Pairing Code</span>
                            </button>
                        </div>

                        <div className={styles.content}>
                            {activeTab === 'qrcode' ? (
                                <div className={styles.qrSection}>
                                    <div className={styles.infoBox}>
                                        <Info size={18} />
                                        <p>Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código abaixo.</p>
                                    </div>

                                    <div className={styles.qrDisplay}>
                                        {loading ? (
                                            <div className={styles.qrLoading}>
                                                <Loader2 size={40} className={styles.spin} />
                                                <span>Gerando código...</span>
                                            </div>
                                        ) : qrBase64 ? (
                                            <>
                                                <div className={styles.qrCodeContainer}>
                                                    <img src={qrBase64} alt="QR Code" />
                                                </div>
                                                <div className={styles.timer}>
                                                    O código expira em <span>{timeLeft}s</span>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => startConnection(currentInstance.id)}>
                                                    Atualizar QR Code
                                                </Button>
                                            </>
                                        ) : (
                                            <div className={styles.qrLoading}>
                                                <Loader2 size={40} className={styles.spin} />
                                                <span>Iniciando conexão...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.pairingSection}>
                                    <div className={styles.infoBox}>
                                        <Hash size={18} />
                                        <p>Se preferir, conecte usando o código de emparelhamento de 8 dígitos.</p>
                                    </div>

                                    {pairingCode && pairingCode.length > 0 ? (
                                        <div className={styles.pairingDisplay}>
                                            <p className={styles.pairingPhone}>Para o número: <strong>{phone}</strong></p>
                                            <div className={styles.codeContainer}>
                                                {pairingCode.split('').map((char, i) => {
                                                    if (char === '-') {
                                                        return <span key={i} className={styles.codeSeparator} />;
                                                    }
                                                    return (
                                                        <span key={i} className={styles.codeChar}>
                                                            {char}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <p className={styles.pairingTip}>Insira este código no seu WhatsApp.</p>
                                        </div>
                                    ) : loading ? (
                                        <div className={styles.qrLoading}>
                                            <Loader2 size={40} className={styles.spin} />
                                            <span>Gerando código de pareamento...</span>
                                        </div>
                                    ) : (
                                        <div className={styles.pairingForm}>
                                            <input
                                                type="text"
                                                placeholder="Seu n°: 5511999999999"
                                                className={styles.phoneInput}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            <Button fullWidth onClick={() => startConnection(currentInstance.id, phone)} loading={loading}>
                                                Gerar Código
                                            </Button>
                                        </div>
                                    )}

                                    <div className={styles.pairingSteps}>
                                        <p>1. No WhatsApp, vá em Aparelhos Conectados</p>
                                        <p>2. Clique em Conectar com número de telefone</p>
                                        <p>3. Insira o código acima quando solicitado</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ConexaoModal;
