import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (tokens: { accessToken: string; refreshToken: string }, user?: AuthUser) => void;
  logout: () => void;
}

// Persisted to localStorage so the session survives a page refresh.
// Note: this is a real deployed Next.js app (not a claude.ai artifact), so
// browser storage APIs are fully supported here.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setSession: (tokens, user) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user ?? null,
          isAuthenticated: true,
        }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    { name: 'peakfuel-auth' },
  ),
);
