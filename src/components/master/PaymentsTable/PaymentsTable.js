'use client';

import React from 'react';
import styles from './PaymentsTable.module.css';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

const PaymentsTable = ({ payments = [] }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Organizador</th>
                        <th>Grupo</th>
                        <th>Valor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td className={styles.dateCell}>{payment.date}</td>
                            <td className={styles.senderCell}>{payment.user}</td>
                            <td className={styles.groupCell}>{payment.group}</td>
                            <td className={styles.priceCell}>R$ {payment.amount.toFixed(2)}</td>
                            <td>
                                <div className={clsx(styles.badge, payment.status === 'paid' ? styles.paid : styles.pending)}>
                                    {payment.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                    <span>{payment.status === 'paid' ? 'Pago' : 'Pendente'}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsTable;

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
