'use client';

import React from 'react';
import { Search, MoreVertical, Edit2, Trash2, Mail } from 'lucide-react';
import styles from './UsersTable.module.css';
import Button from '@/components/ui/Button/Button';

const UsersTable = ({ users = [] }) => {
    return (
        <div className={styles.container}>
            <div className={styles.tableHeader}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input type="text" placeholder="Buscar organizador..." />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Organizador</th>
                            <th>WhatsApp</th>
                            <th>Grupos Ativos</th>
                            <th>Total Gasto</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className={styles.userCell}>
                                    <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                    <div className={styles.info}>
                                        <span className={styles.name}>{user.name}</span>
                                        <span className={styles.email}>{user.email}</span>
                                    </div>
                                </td>
                                <td className={styles.phoneCell}>{user.phone}</td>
                                <td className={styles.centerCell}>{user.activeGroups}</td>
                                <td className={styles.priceCell}>R$ {user.totalSpent.toFixed(2)}</td>
                                <td>
                                    <span className={clsx(styles.badge, user.status === 'active' ? styles.active : styles.inactive)}>
                                        {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn}><Edit2 size={16} /></button>
                                        <button className={styles.actionBtn}><Mail size={16} /></button>
                                        <button className={clsx(styles.actionBtn, styles.delete)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
