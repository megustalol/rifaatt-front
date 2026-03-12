'use client';

import React from 'react';
import styles from './PlansTable.module.css';
import Button from '../../ui/Button/Button';
import { Edit2, Trash2, Globe, Lock, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

const PlansTable = ({ plans, onEdit, onDelete }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome do Plano</th>
                        <th>Preço</th>
                        <th>Instâncias</th>
                        <th>Grupos</th>
                        <th>Público</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={styles.empty}>Nenhum plano encontrado.</td>
                        </tr>
                    ) : (
                        plans.map((plan) => (
                            <tr key={plan.id}>
                                <td className={styles.planName}>
                                    <strong>{plan.name}</strong>
                                    {plan.description && <span>{plan.description}</span>}
                                </td>
                                <td className={styles.priceCell}>
                                    R$ {parseFloat(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td>{plan.instanceLimit}</td>
                                <td>{plan.groupLimit}</td>
                                <td>
                                    {plan.isPublic ? (
                                        <div className={styles.badgeLine}>
                                            <Globe size={14} className={styles.publicIcon} />
                                            Sim
                                        </div>
                                    ) : (
                                        <div className={styles.badgeLine}>
                                            <Lock size={14} className={styles.privateIcon} />
                                            Não
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className={clsx(styles.statusBadge, plan.status === 'active' ? styles.active : styles.inactive)}>
                                        {plan.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </div>
                                </td>
                                <td className={styles.actions}>
                                    <Button variant="ghost" size="sm" icon={Edit2} onClick={() => onEdit(plan)}>Editar</Button>
                                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(plan.id)} className={styles.deleteBtn}>Excluir</Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PlansTable;
