import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import FavoritePage from './pages/FavoritePage.vue'

const app = createApp(App)

const routes = [
    { path: '/', name: '', component: HomePage  },
    { path: '/favorites', name: 'favorites', component: FavoritePage },
  ]

const router = createRouter({
    history: createWebHistory(), 
    routes
})

app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')