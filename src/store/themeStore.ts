import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      toggleTheme: () => set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'dex-workflowverse-theme',
    }
  )
);