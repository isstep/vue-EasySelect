import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function parseUserFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < nowInSeconds) {
      console.warn('Token has expired.');
      return null;
    }
    return {
      uid: decoded.uid,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const tokenFromStorage = localStorage.getItem('authToken');
    const userJsonFromStorage = localStorage.getItem('authUser');
    let initialUser = null;
    let initialToken = null;

    if (tokenFromStorage && userJsonFromStorage) {
      const parsedTokenUser = parseUserFromToken(tokenFromStorage);
      if (parsedTokenUser) {
        try {
          initialUser = JSON.parse(userJsonFromStorage);
          initialToken = tokenFromStorage;
          if (initialUser && typeof parsedTokenUser.isAdmin !== 'undefined') {
            initialUser.isAdmin = parsedTokenUser.isAdmin;
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
          localStorage.removeItem('authUser');
          localStorage.removeItem('authToken');
        }
      } else {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }
    }
    
    return {
      token: initialToken,
      user: initialUser,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    getUserId: (state) => state.user?.uid,
    getUserEmail: (state) => state.user?.email,
    isAdmin: (state) => state.user?.isAdmin === true,
    getUserDisplayName: (state) => {
      if (state.user?.firstName && state.user?.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`;
      }
      return state.user?.email || 'Гость';
    },
  },

  actions: {
    async processLoginResponse(responseData) {
      const { token, user: serverUser } = responseData;

      if (!token || !serverUser) {
        console.error('Token or user data missing in login response.');
        this.logout();
        throw new Error('Invalid login response from server.');
      }
      
      const parsedTokenUser = parseUserFromToken(token);
      if (!parsedTokenUser) {
        this.logout();
        throw new Error('Received token is invalid or expired.');
      }

      this.token = token;
      this.user = {
        ...serverUser,
        isAdmin: parsedTokenUser.isAdmin
      };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(this.user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Login successful, auth state updated:', this.user);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      delete axios.defaults.headers.common['Authorization'];
      console.log('User logged out.');
    },

    initializeAuth() {
        const tokenFromStorage = localStorage.getItem('authToken');
        const userJsonFromStorage = localStorage.getItem('authUser');

        if (tokenFromStorage && userJsonFromStorage) {
            const parsedTokenUser = parseUserFromToken(tokenFromStorage);
            if (parsedTokenUser) {
                try {
                    const storedUser = JSON.parse(userJsonFromStorage);
                    this.token = tokenFromStorage;
                    this.user = {
                        ...storedUser,
                        isAdmin: parsedTokenUser.isAdmin
                    };
                    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromStorage}`;
                    console.log('Auth state initialized from localStorage.');
                } catch (e) {
                    console.error("Error initializing auth from localStorage", e);
                    this.logout();
                }
            } else {
                this.logout();
            }
        } else {
            if (this.token || this.user) {
                this.logout();
            }
        }
    }
  },
});