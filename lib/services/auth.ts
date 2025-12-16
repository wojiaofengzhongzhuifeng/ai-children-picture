export interface IAuthService {
  signUp(email: string, password: string, metadata?: Record<string, any>): Promise<{ user: any; session: any }>
  signIn(email: string, password: string): Promise<{ user: any; session: any }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<any>
  onAuthStateChange(callback: (event: string, session: any) => void): () => void
  resetPassword(email: string): Promise<void>
  updatePassword(newPassword: string): Promise<void>
  updateUser(metadata: Record<string, any>): Promise<any>
}
