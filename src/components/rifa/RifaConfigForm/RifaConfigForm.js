'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { Ticket, DollarSign, Award, MessageSquare } from 'lucide-react';
import styles from './RifaConfigForm.module.css';

const RifaConfigForm = ({ config = {}, onChange, onSave }) => {
    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <Ticket size={24} className={styles.icon} />
                <h3>Configuração da Rifa</h3>
            </div>

            <form className={styles.form}>
                <Input
                    label="Título da Rifa"
                    value={config.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="Ex: Rifa do iPhone 15"
                    className={styles.field}
                />

                <Input
                    label="Prêmio"
                    value={config.prize || ''}
                    onChange={(e) => onChange('prize', e.target.value)}
                    placeholder="O que o ganhador leva?"
                    icon={Award}
                    className={styles.field}
                />

                <div className={styles.row}>
                    <Input
                        label="Valor da Dezena"
                        type="number"
                        value={config.price || ''}
                        onChange={(e) => onChange('price', e.target.value)}
                        placeholder="0.00"
                        icon={DollarSign}
                        className={styles.field}
                    />
                    <Input
                        label="Chave PIX"
                        value={config.pixKey || ''}
                        onChange={(e) => onChange('pixKey', e.target.value)}
                        placeholder="CPF, Email ou Aleatória"
                        className={styles.field}
                    />
                </div>

                <div className={styles.textareaWrapper}>
                    <label className={styles.label}>Mensagem de Boas-vindas</label>
                    <textarea
                        className={styles.textarea}
                        value={config.welcomeMsg || ''}
                        onChange={(e) => onChange('welcomeMsg', e.target.value)}
                        placeholder="Enviada quando alguém entra no grupo..."
                    />
                </div>

                <Button fullWidth onClick={onSave}>Salvar Configuração</Button>
            </form>
        </Card>
    );
};

export default RifaConfigForm;
