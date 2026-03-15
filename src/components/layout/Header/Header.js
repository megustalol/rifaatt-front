'use client';

import React, { useState } from 'react';
import {
    Menu,
    Search,
    Bell,
    ChevronDown,
    User as UserIcon,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';
import clsx from 'clsx';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Get current page title from path
    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length === 0) return 'Dashboard';
        
        const lastSegment = segments[segments.length - 1];
        
        // If the last segment is a UUID (common for detail pages), use the previous segment
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(lastSegment) && segments.length > 1) {
            const parentSegment = segments[segments.length - 2];
            return parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1);
        }

        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button className={styles.menuButton} onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
            </div>

            <div className={styles.right}>
                <div className={styles.divider} />

                <div className={styles.profileContainer}>
                    <button
                        className={styles.profileButton}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className={styles.avatar}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className={styles.userName}>{user?.name?.split(' ')[0] || 'Usuário'}</span>
                        <ChevronDown size={16} className={clsx(isProfileOpen && styles.rotate)} />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className={styles.dropdownOverlay} onClick={() => setIsProfileOpen(false)} />
                            <div className={styles.dropdown}>
                                <Link href="/perfil" className={styles.dropdownItem} onClick={() => setIsProfileOpen(false)}>
                                    <UserIcon size={18} />
                                    <span>Meu Perfil</span>
                                </Link>
                                <Link href="/perfil" className={styles.dropdownItem} onClick={() => setIsProfileOpen(false)}>
                                    <Settings size={18} />
                                    <span>Configurações</span>
                                </Link>
                                <div className={styles.dropdownDivider} />
                                <button className={styles.logoutItem} onClick={logout}>
                                    <LogOut size={18} />
                                    <span>Sair</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
