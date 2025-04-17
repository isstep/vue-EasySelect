import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import FavoritePage from './pages/FavoritePage.vue'
import OrderPage from './pages/OrderPage.vue'
import NewsPage from './components/FooterPages/NewsPage.vue'
import ContactsPage from './components/FooterPages/ContactsPage.vue'
import PaymentDeliveryPage from './components/FooterPages/PaymentDeliveryPage.vue'
import AboutPage from './components/FooterPages/AboutPage.vue'
import LoginComponent from './pages/LoginPage.vue'
import SuccessPage from './pages/SuccessPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import ConfirmationPage from './pages/ConfirmationPage.vue'
import ProductPage from './pages/ProductPage.vue'
import CatalogProductListPage from './pages/CatalogProductListPage.vue'
import ProductCreate from './components/Admin/ProductCreate.vue'

const app = createApp(App)
const pinia = createPinia()

const routes = [
  { path: '/adm', name: 'admin', component: ProductCreate},
  { path: '/catalog/:categoryId', name: 'Catalog', component: CatalogProductListPage },
  { path: '/product/:id', name: 'ProductPage', component: ProductPage, props: true },
  { path: '/confirmation', name: 'ConfirmationPage', component: ConfirmationPage,  meta: { hideHeader: true, hideFooter: true }},
  { path: '/register', name: 'RegisterPage', component: RegisterPage, meta: { hideHeader: true } },
  { path: '/success',name: 'SuccessPage',component: SuccessPage, meta: { hideHeader: true, hideFooter: true } },
  { path: '/', name: '', component: HomePage, meta: { hideHeader: false } },
  { path: '/favorites', name: 'favorites', component: FavoritePage, meta: { hideHeader: false } },
  { path: '/login', name: 'login', component: LoginComponent, meta: { hideHeader: true } },
  { path: '/order', name: 'order', component: OrderPage, meta: { hideHeader: false } },
  { path: '/news', name: 'news', component: NewsPage, meta: false },
  { path: '/about', name: 'about', component: AboutPage, meta: false },
  { path: '/contacts', name: 'contacts', component: ContactsPage, meta: false },
  { path: '/paymentDelivery', name: 'paymentDelivery', component: PaymentDeliveryPage, meta: false },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(pinia)
app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')


