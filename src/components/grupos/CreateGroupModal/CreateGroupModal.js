'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { Smartphone, Hash, Users, Laptop } from 'lucide-react';
import styles from './CreateGroupModal.module.css';
import clsx from 'clsx';

import api from '@/services/api';

export default function CreateGroupModal({ isOpen, onClose, onCreate }) {
    const [name, setName] = useState('');
    const [jid, setJid] = useState('');
    const [selectedInstanceId, setSelectedInstanceId] = useState('');
    const [instances, setInstances] = useState([]);
    const [mode, setMode] = useState('link'); // 'link' or 'create'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            api.get('/instances').then(res => setInstances(res.data));
        }
    }, [isOpen]);

    const selectedInstance = instances.find(i => i.id === selectedInstanceId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'create') {
                const res = await api.post('/raffles/create-group', {
                    instanceId: selectedInstanceId,
                    groupName: name
                });
                onCreate(res.data);
            } else {
                const res = await api.post('/raffles/groups', {
                    name,
                    jid,
                    instanceId: selectedInstanceId
                });
                onCreate(res.data);
            }
            onClose();
            // Reset form
            setName('');
            setJid('');
            setSelectedInstanceId('');
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao processar grupo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Vincular Novo Grupo"
            size="md"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <p className={styles.description}>
                    Preencha os dados abaixo para vincular um grupo do WhatsApp à plataforma.
                </p>

                <div className={styles.modeToggle}>
                    <button
                        type="button"
                        className={clsx(styles.modeBtn, mode === 'link' && styles.active)}
                        onClick={() => setMode('link')}
                    >
                        Vincular Existente
                    </button>
                    <button
                        type="button"
                        className={clsx(styles.modeBtn, mode === 'create' && styles.active)}
                        onClick={() => setMode('create')}
                    >
                        Criar Novo no Painel
                    </button>
                </div>

                <div className={styles.fields}>
                    <Input
                        label="Nome do Grupo"
                        placeholder="Ex: Rifa Mensal de Amigos"
                        icon={Users}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {mode === 'link' && (
                        <Input
                            label="ID do Grupo (JID)"
                            placeholder="Ex: 1203630234567890@g.us"
                            icon={Hash}
                            value={jid}
                            onChange={(e) => setJid(e.target.value)}
                            required
                        />
                    )}

                    <div className={styles.selectWrapper}>
                        <label className={styles.selectLabel}>Instância (WhatsApp)</label>
                        <div className={styles.selectContainer}>
                            <Laptop className={styles.selectIcon} size={20} />
                            <select
                                className={styles.select}
                                value={selectedInstanceId}
                                onChange={(e) => setSelectedInstanceId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecione a instância...</option>
                                {instances.filter(i => i.status === 'connected').map(instance => (
                                    <option key={instance.id} value={instance.id}>
                                        {instance.name} ({instance.phone})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedInstance && (
                        <div className={styles.phoneDisplay}>
                            <Smartphone size={18} />
                            <span>Celular Vinculado: <strong>{selectedInstance.phone}</strong></span>
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={!selectedInstanceId}>Ativar Grupo</Button>
                </div>
            </form>
        </Modal>
    );
}
