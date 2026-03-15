import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import { Plus, X, Smartphone, Users as UsersIcon, CheckCircle, Search, User, ShieldCheck, Clock, Calendar, Lock, Globe, Shield } from 'lucide-react';
import styles from './CreatePlanModal.module.css';
import api from '@/services/api';

const CreatePlanModal = ({ isOpen, onClose, onCreate, planToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [instanceLimit, setInstanceLimit] = useState(1);
    const [groupLimit, setGroupLimit] = useState(1);
    const [durationDays, setDurationDays] = useState(30);
    const [isPublic, setIsPublic] = useState(true);
    const [status, setStatus] = useState('active');
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState('');
    const [loading, setLoading] = useState(false);
    
    // User Selection State
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (planToEdit) {
            setName(planToEdit.name || '');
            setDescription(planToEdit.description || '');
            setPrice(planToEdit.price || '');
            setInstanceLimit(planToEdit.instanceLimit || 1);
            setGroupLimit(planToEdit.groupLimit || 1);
            setDurationDays(planToEdit.durationDays || 30);
            setIsPublic(planToEdit.isPublic !== false);
            setStatus(planToEdit.status || 'active');
            setFeatures(planToEdit.features || []);
            setSelectedUserIds(planToEdit.allowedUsers?.map(u => u.id) || []);
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setInstanceLimit(1);
            setGroupLimit(1);
            setDurationDays(30);
            setIsPublic(true);
            setStatus('active');
            setFeatures([]);
            setSelectedUserIds([]);
        }
    }, [planToEdit, isOpen]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await api.get('/users');
            setAllUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

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

    const toggleUserSelection = (userId) => {
        if (selectedUserIds.includes(userId)) {
            setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
        } else {
            setSelectedUserIds([...selectedUserIds, userId]);
        }
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
                durationDays: parseInt(durationDays),
                isPublic,
                status,
                features,
                allowedUserIds: isPublic ? [] : selectedUserIds
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

    const filteredUsers = allUsers.filter(u => 
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );

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
                        <div className={styles.inputWithIcon}>
                            <Shield size={16} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Profissional, Elite"
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Preço (R$)</label>
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

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Duração (dias)</label>
                        <div className={styles.inputWithIcon}>
                            <Clock size={16} />
                            <input
                                type="number"
                                value={durationDays}
                                onChange={(e) => setDurationDays(e.target.value)}
                                min="1"
                                placeholder="Ex: 30"
                                required
                            />
                        </div>
                    </div>
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

                <div className={styles.visibilityToggle}>
                    <div 
                        className={clsx(styles.toggleOption, isPublic && styles.toggleOptionActive)}
                        onClick={() => setIsPublic(true)}
                    >
                        <Globe size={16} />
                        <div>
                            <span>Público</span>
                            <p>Exibir na Landing Page</p>
                        </div>
                    </div>
                    <div 
                        className={clsx(styles.toggleOption, !isPublic && styles.toggleOptionActive)}
                        onClick={() => setIsPublic(false)}
                    >
                        <Lock size={16} />
                        <div>
                            <span>Personalizado</span>
                            <p>Vender sob demanda</p>
                        </div>
                    </div>
                </div>

                <div className={styles.statusToggles}>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={status === 'active'}
                                onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                            />
                            <span><strong>Plano Ativo:</strong> Disponível para checkout e uso.</span>
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <span><strong>Visualização Pública:</strong> Aparece na Landing Page e Site.</span>
                        </label>
                    </div>
                </div>

                {!isPublic && (
                    <div className={styles.userSelectionSection}>
                        <div className={styles.sectionHeader}>
                            <label>Vincular a Usuários Específicos</label>
                            <p className={styles.hint}>Este plano só será visível para os usuários selecionados.</p>
                        </div>

                        <div className={styles.searchBox}>
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="Buscar usuários por nome ou email..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                        </div>

                        <div className={styles.userList}>
                            {loadingUsers ? (
                                <div className={styles.emptyState}>Carregando usuários...</div>
                            ) : filteredUsers.length === 0 ? (
                                <div className={styles.emptyState}>Nenhum usuário encontrado.</div>
                            ) : (
                                filteredUsers.map(u => (
                                    <div 
                                        key={u.id} 
                                        className={clsx(styles.userItem, selectedUserIds.includes(u.id) && styles.userItemActive)}
                                        onClick={() => toggleUserSelection(u.id)}
                                    >
                                        <div className={styles.userAvatar}>
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{u.name}</span>
                                            <span className={styles.userEmail}>{u.email}</span>
                                        </div>
                                        {selectedUserIds.includes(u.id) && (
                                            <div className={styles.selectedBadge}>
                                                <CheckCircle size={14} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

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

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
