import { supabase } from '@/lib/supabase/client'
import { IAuthService } from '@/lib/services/auth'

export class SupabaseAuthService implements IAuthService {
  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error
    return {
      user: data.user,
      session: data.session
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return {
      user: data.user,
      session: data.session
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return {
      subscription,
      unsubscribe: () => subscription.unsubscribe()
    }
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  }

  async updateUser(metadata: Record<string, any>) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    })
    if (error) throw error
    return data.user
  }
}
