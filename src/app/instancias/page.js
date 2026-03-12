'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import InstanciaCard from '@/components/instancia/InstanciaCard/InstanciaCard';
import ConexaoModal from '@/components/instancia/ConexaoModal/ConexaoModal';
import Button from '@/components/ui/Button/Button';
import { Plus } from 'lucide-react';
import styles from './page.module.css';

import api from '@/services/api';
import Skeleton from '@/components/ui/Skeleton/Skeleton';

export default function InstanciasPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setSelectedInstance(null);
        setIsModalOpen(true);
    };

    const handleCreated = () => {
        fetchInstances();
        setIsModalOpen(false);
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
                                onEdit={() => console.log('Edit', instance.id)}
                                onDelete={() => console.log('Delete', instance.id)}
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
            </div>
        </DashboardLayout>
    );
}
