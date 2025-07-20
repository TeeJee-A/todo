import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { initializeEcho } from '@/echo'
import type { User } from '@/types'

// Type pour l'état du store d'authentification
interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    currentUser: (state): User | null => state.user,
  },
  actions: {
    async login(credentials: Record<'email' | 'password', string>) {
      try {
        const response = await axios.post<{ token: string; user: User }>('/api/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user)) // Stocker l'utilisateur pour Echo
        
        initializeEcho(token)
        
        await router.push({ name: 'tasks' })
      } catch (error) {
        console.error("Erreur de connexion:", error)
        throw error
      }
    },

    async register(userData: Omit<User, 'id'> & {password: string}) {
      // Omit<User, 'id'> prend le type User et enlève la propriété 'id'
      try {
        await axios.post('/api/auth/register', userData)
        await router.push({ name: 'login' })
      } catch (error) {
        console.error("Erreur d'inscription:", error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({ name: 'login' })
    },

    async tryToLoginFromLocalStorage() {
      if (this.token) {
        try {
          const response = await axios.get<{ user: User }>('/api/user') // API pour obtenir l'utilisateur actuel
          this.user = response.data.user
          localStorage.setItem('user', JSON.stringify(this.user))
          initializeEcho(this.token)
        } catch (error) {
          console.error("Token invalide, déconnexion.")
          this.logout()
        }
      }
    },
  },
})