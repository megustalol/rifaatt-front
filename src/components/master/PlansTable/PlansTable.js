'use client';

import React from 'react';
import styles from './PlansTable.module.css';
import Button from '../../ui/Button/Button';
import { Edit2, Trash2, Globe, Lock, CheckCircle, XCircle, Users, Clock, Maximize2, Smartphone } from 'lucide-react';
import clsx from 'clsx';

const PlansTable = ({ plans, onEdit, onDelete, onManageUsers, loading }) => {
    return (
        <div className={styles.container}>
            {/* Legend - Visible on all views */}
            <div className={styles.legendWrapper}>
                <div className={styles.legendContainer}>
                    <div className={styles.legendItem}>
                        <div className={clsx(styles.legendColor, styles.legendColorPublic)}></div>
                        <span><strong>Ciano:</strong> Plano Público</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={clsx(styles.legendColor, styles.legendColorPrivate)}></div>
                        <span><strong>Safira:</strong> Plano Personalizado (Privado)</span>
                    </div>
                </div>
            </div>

            {/* View Mobile (Cards) */}
            <div className={styles.mobileCards}>
                {plans.length === 0 ? (
                    <div className={styles.emptyState}>Nenhum plano encontrado.</div>
                ) : (
                    plans.map((plan) => {
                        const rowClass = plan.isPublic ? styles.publicRow : styles.privateRow;
                        return (
                            <div key={plan.id} className={clsx(styles.planCard, rowClass)}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.planTitle}>
                                        <strong>{plan.name}</strong>
                                        <span>{plan.description}</span>
                                    </div>
                                    <div className={styles.price}>
                                        R$ {parseFloat(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div className={styles.cardStats}>
                                    <div className={styles.stat}>
                                        <Clock size={12} /> {plan.durationDays || 0}d
                                    </div>
                                    <div className={styles.stat}>
                                        <Smartphone size={12} /> {plan.instanceLimit}
                                    </div>
                                    <div className={styles.stat}>
                                        <Users size={12} /> {plan.groupLimit}
                                    </div>
                                    <div className={styles.stat} title="Vinculados">
                                        <strong>Vinc:</strong> {plan.isPublic ? '-' : (plan.allowedUsers?.length || 0)}
                                    </div>
                                </div>
                                <div className={styles.cardFooter}>
                                    <div className={styles.badges}>
                                        {plan.isPublic ? (
                                            <div className={styles.typeBadge} title="Público">
                                                <Globe size={12} /> Sim
                                            </div>
                                        ) : (
                                            <div className={styles.typeBadgePrivate} title="Personalizado">
                                                <Lock size={12} /> Privat.
                                            </div>
                                        )}
                                        <div className={clsx(styles.statusBadgeSmall, plan.status === 'active' ? styles.active : styles.inactive)}>
                                            {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </div>
                                    </div>
                                    <div className={styles.actions}>
                                        {!plan.isPublic && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                icon={Search} 
                                                onClick={() => onManageUsers(plan)} 
                                                title="Ver usuários" 
                                                className={styles.expandActionBtn}
                                            />
                                        )}
                                        <Button variant="ghost" size="sm" icon={Edit2} onClick={() => onEdit(plan)} />
                                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(plan.id)} className={styles.deleteBtn} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* View Desktop (Table) */}
            <div className={styles.desktopTable}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome do Plano</th>
                                <th>Preço</th>
                                <th>Duração</th>
                                <th>Instâncias</th>
                                <th>Grupos</th>
                                <th>Vinculados</th>
                                <th>Público</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className={styles.empty}>Nenhum plano encontrado.</td>
                                </tr>
                            ) : (
                                plans.map((plan) => {
                                    const rowClass = plan.isPublic ? styles.publicRow : styles.privateRow;
                                    return (
                                        <tr key={plan.id} className={rowClass}>
                                        <td className={styles.planName}>
                                            <strong>{plan.name}</strong>
                                            {plan.description && <span>{plan.description}</span>}
                                        </td>
                                        <td className={styles.priceCell}>
                                            R$ {parseFloat(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className={styles.durationCell}>{plan.durationDays || 0} dias</td>
                                        <td>{plan.instanceLimit}</td>
                                        <td>{plan.groupLimit}</td>
                                        <td>
                                            {plan.isPublic ? '-' : (
                                                <div className={styles.linkedUsers}>
                                                    <Users size={12} /> {plan.allowedUsers?.length || 0}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {plan.isPublic ? (
                                                <div className={styles.badgeLine}>
                                                    <Globe size={14} className={styles.publicIcon} />
                                                    Sim
                                                </div>
                                            ) : (
                                                <div className={styles.badgeLine}>
                                                    <Lock size={14} className={styles.privateIcon} />
                                                    Personalizado
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
                                            <div className={styles.actionGroup}>
                                                {!plan.isPublic && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        icon={Search} 
                                                        onClick={() => onManageUsers(plan)} 
                                                        title="Ver usuários vinculados" 
                                                    />
                                                )}
                                                <Button variant="ghost" size="sm" icon={Edit2} onClick={() => onEdit(plan)} title="Editar" />
                                                <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(plan.id)} className={styles.deleteBtn} title="Excluir" />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default PlansTable;
