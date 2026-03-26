import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
    persist(
        (set) => ({
            language: 'en', // 'en' or 'bn'
            theme: 'light', // 'light' or 'dark'
            isFullScreen: false,
            isSidebarOpen: true,
            isCollapsed: false,

            setLanguage: (lang) => set({ language: lang }),
            toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'bn' : 'en' })),

            setTheme: (theme) => {
                set({ theme });
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            },
            toggleTheme: () => {
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { theme: newTheme };
                });
            },

            toggleFullScreen: () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    set({ isFullScreen: true });
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                        set({ isFullScreen: false });
                    }
                }
            },

            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
            toggleSidebarCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
            setSidebarCollapsed: (isCollapsed) => set({ isCollapsed }),
        }),
        {
            name: 'app-storage',
        }
    )
);
