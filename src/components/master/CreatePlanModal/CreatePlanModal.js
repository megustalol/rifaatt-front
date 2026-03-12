'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import { Plus, X, Percent, Smartphone, Users as UsersIcon, List, CheckCircle } from 'lucide-react';
import styles from './CreatePlanModal.module.css';

const CreatePlanModal = ({ isOpen, onClose, onCreate, planToEdit }) => {
    // ... items omitted for brevity ...
    // Note: I'm replacing the entire component body for clarity as per user request to improve it
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [instanceLimit, setInstanceLimit] = useState(1);
    const [groupLimit, setGroupLimit] = useState(1);
    const [isPublic, setIsPublic] = useState(true);
    const [status, setStatus] = useState('active');
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (planToEdit) {
            setName(planToEdit.name || '');
            setDescription(planToEdit.description || '');
            setPrice(planToEdit.price || '');
            setInstanceLimit(planToEdit.instanceLimit || 1);
            setGroupLimit(planToEdit.groupLimit || 1);
            setIsPublic(planToEdit.isPublic !== false);
            setStatus(planToEdit.status || 'active');
            setFeatures(planToEdit.features || []);
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setInstanceLimit(1);
            setGroupLimit(1);
            setIsPublic(true);
            setStatus('active');
            setFeatures([]);
        }
    }, [planToEdit, isOpen]);

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, { text: newFeature.trim(), active: true }]);
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const toggleFeatureStatus = (index) => {
        const updated = [...features];
        updated[index].active = !updated[index].active;
        setFeatures(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                description,
                price: parseFloat(price),
                instanceLimit: parseInt(instanceLimit),
                groupLimit: parseInt(groupLimit),
                isPublic,
                status,
                features
            };
            await onCreate(payload, planToEdit?.id);
            onClose();
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Erro ao salvar plano: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={planToEdit ? 'Editar Plano' : 'Criar Novo Plano'}
            size="md"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Nome do Plano</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Profissional, Elite"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Preço (Mensal)</label>
                        <div className={styles.inputWithIcon}>
                            <span>R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0,00"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Breve descrição do plano"
                        rows={2}
                    />
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Limite de Instâncias</label>
                        <div className={styles.inputWithIcon}>
                            <Smartphone size={16} />
                            <input
                                type="number"
                                value={instanceLimit}
                                onChange={(e) => setInstanceLimit(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Limite de Grupos</label>
                        <div className={styles.inputWithIcon}>
                            <UsersIcon size={16} />
                            <input
                                type="number"
                                value={groupLimit}
                                onChange={(e) => setGroupLimit(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        <span>Público (exibir na Landing Page)</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={status === 'active'}
                            onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                        />
                        <span>Ativo</span>
                    </label>
                </div>

                <div className={styles.featuresSection}>
                    <div className={styles.sectionHeader}>
                        <label>Benefícios do Plano</label>
                        <p className={styles.hint}>Estes itens aparecerão na Landing Page e no Checkout.</p>
                    </div>
                    
                    <div className={styles.addFeature}>
                        <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Adicionar benefício..."
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        />
                        <button type="button" onClick={handleAddFeature} className={styles.plusBtn}>
                            <Plus size={18} />
                        </button>
                    </div>
                    
                    <div className={styles.featuresList}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureItem}>
                                <button
                                    type="button"
                                    className={styles.toggleBtn}
                                    onClick={() => toggleFeatureStatus(index)}
                                    title={feature.active ? 'Desativar item' : 'Ativar item'}
                                >
                                    <CheckCircle size={16} className={feature.active ? styles.vivid : styles.muted} />
                                </button>
                                <span className={!feature.active ? styles.featureInactive : ''}>{feature.text}</span>
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveFeature(index)}
                                    title="Remover"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" loading={loading}>
                        {planToEdit ? 'Salvar Alterações' : 'Criar Plano'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreatePlanModal;
