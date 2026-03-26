import { create } from 'zustand'

interface PreferenceState {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}))
