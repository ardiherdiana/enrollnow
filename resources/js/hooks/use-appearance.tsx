import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light';

// Force light mode only
const applyTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme() {
    // Always apply light theme
    applyTheme();
    
    // Remove any dark mode from localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem('appearance', 'light');
    }
}

export function useAppearance() {
    const [appearance] = useState<Appearance>('light');

    const updateAppearance = useCallback(() => {
        // Do nothing - always light mode
        applyTheme();
    }, []);

    useEffect(() => {
        // Always set to light mode on mount
        applyTheme();
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('appearance', 'light');
        }
    }, []);

    return { appearance, updateAppearance } as const;
}
