import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userName: string;
  login: (pin: string) => boolean;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userName: 'Sanjeev',
      login: (pin: string) => {
        // Simple PIN-based local auth (default PIN: 1234)
        if (pin === '1234') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      loadUser: () => { /* no-op, persist middleware handles rehydration */ },
    }),
    { name: 'career-os-auth' }
  )
);
