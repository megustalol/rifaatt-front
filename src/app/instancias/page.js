'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import InstanciaCard from '@/components/instancia/InstanciaCard/InstanciaCard';
import ConexaoModal from '@/components/instancia/ConexaoModal/ConexaoModal';
import Button from '@/components/ui/Button/Button';
import { Plus } from 'lucide-react';
import styles from './page.module.css';
import UpgradeModal from '@/components/shared/UpgradeModal/UpgradeModal';
import { useAuth } from '@/context/AuthContext';

import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

export default function InstanciasPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState(null);
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstances();
    }, []);

    const fetchInstances = async () => {
        setLoading(true);
        try {
            const response = await api.get('/instances');
            setInstances(response.data);
        } catch (error) {
            console.error('Error fetching instances:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReconnect = (instance) => {
        setSelectedInstance(instance);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

        // Free Plan Lock (Skip for Admin)
        if (!user?.Plan && !isAdmin) {
            setIsUpgradeModalOpen(true);
            return;
        }

        // Check Limit (Skip for Admin)
        const limit = user?.Plan?.instanceLimit || 1;
        if (instances.length >= limit && !isAdmin) {
            setIsUpgradeModalOpen(true);
            return;
        }

        setSelectedInstance(null);
        setIsModalOpen(true);
    };

    const handleCreated = () => {
        fetchInstances();
        setIsModalOpen(false);
    };

    const handleEdit = async (instance) => {
        const newName = prompt('Novo nome para a instância:', instance.name);
        if (!newName || newName === instance.name) return;

        try {
            await api.patch(`/instances/${instance.id}`, { name: newName });
            fetchInstances();
        } catch (error) {
            console.error('Error updating instance:', error);
            alert('Erro ao atualizar instância.');
        }
    };

    const handleDelete = async (instance) => {
        if (!confirm(`Tem certeza que deseja excluir a instância "${instance.name}"?`)) return;

        try {
            await api.delete(`/instances/${instance.id}`);
            fetchInstances();
        } catch (error) {
            console.error('Error deleting instance:', error);
            alert('Erro ao excluir instância.');
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>Minhas Instâncias</h2>
                        <p className={styles.subtitle}>Gerencie suas conexões de WhatsApp com a plataforma.</p>
                    </div>
                    <Button icon={Plus} onClick={handleCreate}>Nova Instância</Button>
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <Skeleton key={i} height="200px" width="100%" />
                        ))
                    ) : (
                        instances.map((instance) => (
                            <InstanciaCard
                                key={instance.id}
                                {...instance}
                                onReconnect={() => handleReconnect(instance)}
                                onEdit={() => handleEdit(instance)}
                                onDelete={() => handleDelete(instance)}
                            />
                        ))
                    )}
                </div>

                <ConexaoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    instance={selectedInstance}
                    onSuccess={handleCreated}
                />

                <UpgradeModal 
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    featureName="Instâncias"
                    limit={user?.Plan?.instanceLimit || 1}
                    isLocked={!user?.Plan}
                />
            </div>
        </DashboardLayout>
    );
}
