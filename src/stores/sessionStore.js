import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  /** @type {import('@supabase/supabase-js').Session | null} */
  session: null,
  /** @type {import('@supabase/supabase-js').User | null} */
  user: null,
  loading: true,
  /**
   * @param {import('@supabase/supabase-js').Session | null} session
   */
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    }),
  setLoading: (loading) => set({ loading }),
}))
