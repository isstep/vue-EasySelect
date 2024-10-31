import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('authToken'),
    token: localStorage.getItem('authToken') || '',
    user: null 
  }),
  actions: {
    login(token) {
      localStorage.setItem('authToken', token);
      this.token = token;
      this.isAuthenticated = true;
      this.loadUserFromToken(token);
    },
    logout() {
      localStorage.removeItem('authToken');
      this.token = '';
      this.user = null; 
      this.isAuthenticated = false;
    },
    loadToken() {
      this.token = localStorage.getItem('authToken') || '';
      this.isAuthenticated = !!this.token;
      if (this.token) {
        this.loadUserFromToken(this.token);
      }
    },
    loadUserFromToken(token) {
      try {
        const decoded = jwtDecode(token); 
        console.log(decoded);
    
        this.user = {
          id: decoded.uid || null,
          email: decoded.email || null,
          firstName: decoded.firstName || null, 
          lastName: decoded.lastName || null,
          address: decoded.address || null 
        };
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }
});