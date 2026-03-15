'use client';

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './DashboardLayout.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import FreePlanBanner from '@/components/shared/FreePlanBanner/FreePlanBanner';

import TrialPlanBanner from '@/components/shared/TrialPlanBanner/TrialPlanBanner';
import PaymentRequiredModal from '@/components/shared/onboarding/PaymentRequiredModal';
import TrialActivatedModal from '@/components/shared/onboarding/TrialActivatedModal';
import PlanExpiredModal from '@/components/shared/onboarding/PlanExpiredModal';
import api from '@/services/api';

const DashboardLayout = ({ children }) => {
    const { user, refreshUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleClearOnboarding = async () => {
        try {
            await api.post('/users/me/onboarding/clear');
            await refreshUser();
        } catch (error) {
            console.error('Error clearing onboarding:', error);
        }
    };

    const isTrial = !!user?.planExpiresAt && !user?.onboardingType;
    const isExpired = !!user?.planExpiresAt && new Date(user.planExpiresAt) < new Date();
    const firstName = user?.name ? user.name.split(' ')[0] : 'Usuário';

    return (
        <div className={styles.layout}>
            {/* Onboarding Modals */}
            <PaymentRequiredModal 
                isOpen={user?.onboardingType === 'PAYMENT_REQUIRED'} 
                onClose={handleClearOnboarding}
                userName={firstName} 
            />
            <TrialActivatedModal 
                isOpen={user?.onboardingType === 'TRIAL_ACTIVATED'} 
                onClose={handleClearOnboarding}
                user={user} 
            />
            <PlanExpiredModal 
                isOpen={isExpired && user?.role?.toUpperCase() !== 'ADMIN'} 
                onClose={() => refreshUser()}
            />

            {/* Sidebar - Desktop */}
            <aside className={styles.desktopSidebar}>
                <Sidebar />
            </aside>

            {/* Sidebar - Mobile Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.overlay}
                            onClick={toggleSidebar}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={styles.mobileSidebar}
                        >
                            <Sidebar onClose={toggleSidebar} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className={styles.mainContainer}>
                {(!user?.Plan && user?.role?.toUpperCase() !== 'ADMIN' && !user?.planExpiresAt) && <FreePlanBanner />}
                {isTrial && !isExpired && <TrialPlanBanner expiryDate={user.planExpiresAt} user={user} />}
                <Header onMenuClick={toggleSidebar} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
