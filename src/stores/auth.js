import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('authToken'),
    token: localStorage.getItem('authToken') || '',
    user: null 
  }),
  actions: {
    login(token, userData) {
      localStorage.setItem('authToken', token);
      this.token = token;
      this.user = userData;
      this.isAuthenticated = true;
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
    },
    loadUser(userData) {
      this.user = userData; 
    }
  }
});
