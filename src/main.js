import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import FavoritePage from './pages/FavoritePage.vue'
import LoginComponent from './pages/LoginPage.vue'
import OrderPage from './pages/OrderPage.vue'

const app = createApp(App)

const routes = [
  { path: '/', name: '', component: HomePage, meta: { hideHeader: false } },
  { path: '/favorites', name: 'favorites', component: FavoritePage, meta: { hideHeader: false } },
  { path: '/login', name: 'login', component: LoginComponent, meta: { hideHeader: true } },
  { path: '/order', name: 'order', component: OrderPage, meta: { hideHeader: false}}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')
