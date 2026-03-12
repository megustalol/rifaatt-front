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

    const startConnection = async (id) => {
        setLoading(true);
        try {
            const response = await api.get(`/instances/connect/${id}`);
            if (response.data.base64) {
                setQrBase64(response.data.base64);
                setTimeLeft(60);
            }
            if (response.data.pairingCode) {
                setPairingCode(response.data.pairingCode);
            }
            startPolling(id);
        } catch (error) {
            console.error('Error connecting:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!name || !apiUrl || !adminToken) return;
        setLoading(true);
        try {
            const response = await api.post('/instances', { name, apiUrl, adminToken });
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
                if (response.data.instance.status === 'connected') {
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
                            <p>Configure sua instância conectando-se ao seu servidor Uazapi.</p>
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

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>URL da API (Uazapi)</label>
                            <input
                                type="text"
                                placeholder="https://api.uazapi.com"
                                className={styles.phoneInput}
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Admin Token (Global)</label>
                            <input
                                type="password"
                                placeholder="Seu admin token do Uazapi"
                                className={styles.phoneInput}
                                value={adminToken}
                                onChange={(e) => setAdminToken(e.target.value)}
                            />
                        </div>

                        <Button
                            fullWidth
                            onClick={handleCreate}
                            loading={loading}
                            disabled={!name || !apiUrl || !adminToken}
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

                                    {pairingCode ? (
                                        <div className={styles.pairingDisplay}>
                                            <div className={styles.codeContainer}>
                                                {pairingCode.split('').map((char, i) => (
                                                    <span key={i} className={styles.codeChar}>{char}</span>
                                                ))}
                                            </div>
                                            <p className={styles.pairingTip}>Insira este código no seu WhatsApp.</p>
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
                                            <Button fullWidth onClick={() => startConnection(currentInstance.id)} loading={loading}>
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
