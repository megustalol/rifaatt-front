'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Smartphone,
    Users,
    Ticket,
    ShieldCheck,
    LogOut,
    History,
    BarChart3,
    X
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import styles from './Sidebar.module.css';
import Image from 'next/image';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Instâncias', icon: Smartphone, href: '/instancias' },
    { label: 'Grupos', icon: Users, href: '/grupos' },
    { label: 'Rifa', icon: Ticket, href: '/rifa' },
    { label: 'Histórico', icon: History, href: '/historico' },
    { label: 'Relatórios', icon: BarChart3, href: '/relatorios' },
];

const Sidebar = ({ onClose }) => {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isAdmin = user?.role === 'admin';

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <Link href="/dashboard" className={styles.logo}>
                    <Image
                        src="/logomenor.png"
                        alt="Rifaatt Logo"
                        width={40}
                        height={40}
                        className={styles.logoImg}
                    />
                    <span className={styles.logoText}>Rifaatt</span>
                </Link>
                {onClose && (
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                            styles.navItem,
                            pathname === item.href && styles.active
                        )}
                        onClick={onClose}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}

                {isAdmin && (
                    <Link
                        href="/master"
                        className={clsx(
                            styles.navItem,
                            pathname === '/master' && styles.active,
                            styles.adminItem
                        )}
                        onClick={onClose}
                    >
                        <ShieldCheck size={20} />
                        <span>Master</span>
                    </Link>
                )}
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user?.name || 'Usuário'}</span>
                        <span className={styles.userRole}>{user?.role === 'admin' ? 'Administrador' : 'Organizador'}</span>
                    </div>
                    <ThemeToggle />
                </div>

                <button className={styles.logoutButton} onClick={logout}>
                    <LogOut size={20} />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
