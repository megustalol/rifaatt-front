'use client';

import React from 'react';
import styles from './PaymentsTable.module.css';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

const PaymentsTable = ({ payments = [] }) => {
    return (
        <div className={styles.tableWrapper}>
            {/* Desktop Table */}
            <div className={styles.desktopTable}>
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
                                <td className={styles.priceCell}>R$ {payment.amount?.toFixed(2) || '0.00'}</td>
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

            {/* Mobile Cards */}
            <div className={styles.mobileCards}>
                {payments.map((payment) => (
                    <div key={payment.id} className={styles.paymentCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    {payment.user?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div className={styles.userName}>{payment.user}</div>
                                    <div className={styles.paymentDate}>{payment.date}</div>
                                </div>
                            </div>
                            <div className={clsx(styles.badge, payment.status === 'paid' ? styles.paid : styles.pending)}>
                                {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.cardInfo}>
                                <span className={styles.infoLabel}>Grupo</span>
                                <span className={styles.infoValue}>{payment.group}</span>
                            </div>
                            <div className={styles.cardInfo}>
                                <span className={styles.infoLabel}>Valor</span>
                                <span className={styles.infoValueHighlight}>R$ {payment.amount?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {payments.length === 0 && (
                    <div className={styles.emptyState}>Nenhum pagamento registrado.</div>
                )}
            </div>
        </div>
    );
};

export default PaymentsTable;

function clsx(...args) {
    return args.filter(Boolean).join(' ');
}
