'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({
    label,
    type = 'text',
    icon: Icon,
    error,
    id,
    className,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const effectiveType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={clsx(styles.container, error && styles.hasError, className)}>
            <div className={styles.inputWrapper}>
                {Icon && <Icon size={20} className={styles.leftIcon} />}

                <input
                    id={id}
                    type={effectiveType}
                    className={clsx(
                        styles.input,
                        Icon && styles.withLeftIcon,
                        isPassword && styles.withRightIcon
                    )}
                    placeholder=" "
                    {...props}
                />

                {label && (
                    <label htmlFor={id} className={styles.label}>
                        {label}
                    </label>
                )}

                {isPassword && (
                    <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Input;
