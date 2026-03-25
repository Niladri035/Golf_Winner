import { create } from 'zustand';

interface UIState {
  theme: 'dark' | 'light';
  isMenuOpen: boolean;
  isCustomCursorEnabled: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleMenu: () => void;
  setCustomCursor: (enabled: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark', // Premium default
  isMenuOpen: false,
  isCustomCursorEnabled: true,
  setTheme: (theme) => set({ theme }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setCustomCursor: (enabled) => set({ isCustomCursorEnabled: enabled }),
}));
