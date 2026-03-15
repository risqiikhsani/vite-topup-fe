import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ProfileData {
  email: string
  first_name: string
  last_name: string
  profile_image: string
}

interface AuthState {
  token: string | null
  isLoggedIn: boolean
  profile: ProfileData | null
  login: (token: string) => void
  logout: () => void
  setProfile: (profile: ProfileData) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      profile: null,
      login: (token) => set({ token, isLoggedIn: true }),
      logout: () => set({ token: null, isLoggedIn: false, profile: null }),
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "auth",
      partialize: (state) => ({ token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
)
