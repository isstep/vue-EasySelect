import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import FavoritePage from './pages/FavoritePage.vue'
import LoginComponent from './pages/LoginPage.vue'
import OrderPage from './pages/OrderPage.vue'
import NewsPage from './components/FooterPages/NewsPage.vue'
import AboutPage from './components/FooterPages/AboutPage.vue'
import FAQPage from './components/FooterPages/FAQPage.vue'
import ContactsPage from './components/FooterPages/ContactsPage.vue'
import PaymentDeliveryPage from './components/FooterPages/PaymentDeliveryPage.vue'
import PickupPointsPage from './components/FooterPages/PickupPointsPage.vue'
import ChatProducts from './components/Сhat/СhatProducts.vue'
import SuccessPage from './pages/SuccessPage.vue'

const app = createApp(App)
const pinia = createPinia()
const routes = [
  { path: '/success', name: 'SuccessPage', component: SuccessPage, meta: { hideHeader: false } },
  { path: '/', name: '', component: HomePage, meta: { hideHeader: false } },
  { path: '/favorites', name: 'favorites', component: FavoritePage, meta: { hideHeader: false } },
  { path: '/login', name: 'login', component: LoginComponent, meta: { hideHeader: true } },
  { path: '/order', name: 'order', component: OrderPage, meta: { hideHeader: false } },

  { path: '/news', name: 'news', component: NewsPage, meta: false },
  { path: '/about', name: 'about', component: AboutPage, meta: false },
  { path: '/FAQ', name: 'FAQ', component: FAQPage, meta: false },
  { path: '/contacts', name: 'contacts', component: ContactsPage, meta: false },
  {
    path: '/paymentDelivery',
    name: 'paymentDelivery',
    component: PaymentDeliveryPage,
    meta: false
  },
  { path: '/pickupPointsPage', name: 'pickupPointsPage', component: PickupPointsPage, meta: false },

  { path: '/Chat', name: 'ChatProducts', component: ChatProducts, meta: { hideFooter: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(pinia)
app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')
