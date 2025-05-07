import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

function initializeUserFromToken(token) {
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    console.log('Initializing user from stored token:', decoded)

    const nowInSeconds = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < nowInSeconds) {
      console.warn('Stored token has expired. Clearing auth state.')
      localStorage.removeItem('authToken')
      return null
    }

    return {
      id: decoded.uid || null,
      email: decoded.email || null,
      firstName: decoded.firstName || null,
      lastName: decoded.lastName || null,
      address: decoded.address || null
    }
  } catch (error) {
    console.error('Error decoding token during store initialization:', error)
    localStorage.removeItem('authToken')
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('authToken')
    const user = initializeUserFromToken(token)

    return {
      isAuthenticated: !!user,
      token: token || '',
      user: user
    }
  },

  actions: {
    login(token) {
      try {
        const decoded = jwtDecode(token)
        const nowInSeconds = Math.floor(Date.now() / 1000)

        if (decoded.exp && decoded.exp < nowInSeconds) {
          this.logout()
          throw new Error('Token expired')
        }

        localStorage.setItem('authToken', token)
        this.token = token
        this.isAuthenticated = true

        this.user = {
          id: decoded.uid || null,
          email: decoded.email || null,
          firstName: decoded.firstName || null,
          lastName: decoded.lastName || null,
          address: decoded.address || null
        }

        console.log('Login successful, user state updated:', this.user)
      } catch (error) {
        console.error('Login failed:', error)
        this.logout()
        throw error
      }
    },

    logout() {
      localStorage.removeItem('authToken')
      this.token = ''
      this.user = null
      this.isAuthenticated = false
      console.log('User logged out.')
    },

    loadUserFromToken(token) {
      try {
        const userFromToken = initializeUserFromToken(token)
        if (userFromToken) {
          this.user = userFromToken
          this.isAuthenticated = true
          this.token = token
          console.log('User data reloaded from token:', this.user)
        } else {
          this.logout()
        }
      } catch (error) {
        console.error('Unexpected error in loadUserFromToken:', error)
        this.logout()
      }
    }
  },

  getters: {
    getName: (state) => state.user?.firstName || state.user?.email || 'Гость',
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    getToken: (state) => state.token,
    getUserId: (state) => state.user?.id,
    getUserEmail: (state) => state.user?.email
  }
})
