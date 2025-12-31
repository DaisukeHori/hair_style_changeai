import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Stylist, Salon } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  stylist: Stylist | null;
  salon: Salon | null;

  // Actions
  setUser: (user: AuthState['user']) => void;
  setStylist: (stylist: Stylist | null) => void;
  setSalon: (salon: Salon | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      stylist: null,
      salon: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setStylist: (stylist) => set({ stylist }),

      setSalon: (salon) => set({ salon }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          stylist: null,
          salon: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        stylist: state.stylist,
        salon: state.salon,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
