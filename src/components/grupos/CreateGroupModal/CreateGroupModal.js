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
    const [availableGroups, setAvailableGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            api.get('/instances').then(res => setInstances(res.data));
            setAvailableGroups([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedInstanceId) {
            fetchInstanceGroups(selectedInstanceId);
        }
    }, [selectedInstanceId]);

    const fetchInstanceGroups = async (id) => {
        setLoadingGroups(true);
        try {
            const res = await api.get(`/raffles/groups-from-instance/${id}`);
            setAvailableGroups(res.data);
        } catch (error) {
            console.error('Error loading groups:', error);
        } finally {
            setLoadingGroups(false);
        }
    };

    const selectedInstance = instances.find(i => i.id === selectedInstanceId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/raffles/groups', {
                name: availableGroups.find(g => g.id === jid)?.subject || name,
                jid,
                instanceId: selectedInstanceId
            });
            onCreate(res.data);
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
                    Selecione uma instância conectada e o grupo que deseja vincular.
                </p>

                <div className={styles.fields}>
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

                    {selectedInstanceId && (
                        <div className={styles.selectWrapper}>
                            <label className={styles.selectLabel}>Grupo para Vincular</label>
                            <div className={styles.selectContainer}>
                                <Users className={styles.selectIcon} size={20} />
                                <select
                                    className={styles.select}
                                    value={jid}
                                    onChange={(e) => setJid(e.target.value)}
                                    required
                                    disabled={loadingGroups}
                                >
                                    <option value="" disabled>
                                        {loadingGroups ? 'Carregando grupos...' : 'Selecione um grupo (onde você é admin)...'}
                                    </option>
                                    {availableGroups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.subject}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {availableGroups.length === 0 && !loadingGroups && selectedInstanceId && (
                                <p className={styles.warningText}>Nenhum grupo encontrado onde você é administrador.</p>
                            )}
                        </div>
                    )}

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
