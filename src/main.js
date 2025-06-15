import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';

import App from './App.vue';
import HomePage from './pages/HomePage.vue';
import FavoritePage from './pages/FavoritePage.vue';
import OrderPage from './pages/OrderPage.vue';
import NewsPage from './components/FooterPages/NewsPage.vue';
import ContactsPage from './components/FooterPages/ContactsPage.vue';
import PaymentDeliveryPage from './components/FooterPages/PaymentDeliveryPage.vue';
import AboutPage from './components/FooterPages/AboutPage.vue';
import LoginComponent from './pages/LoginPage.vue';
import SuccessPage from './pages/SuccessPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import ConfirmationPage from './pages/ConfirmationPage.vue';
import ProductPage from './pages/ProductPage.vue';
import CatalogProductListPage from './pages/CatalogProductListPage.vue';
import ProductCreate from './components/Admin/ProductCreate.vue'; 
import Error404 from './components/ErrorFrom404.vue';
import AdminPage from './components/Admin/AdminPage.vue';
const app = createApp(App);
const pinia = createPinia();
app.use(pinia); 

const authStore = useAuthStore(); 
authStore.initializeAuth(); 

const routes = [
    {
    path: '/adm',
    name: 'admin-dashboard',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true, hideHeader: true, hideFooter: true, hideFloatingButton: true}
  },
  {
    path: '/ProductCreate',
    name: 'admin-ProductCreate',
    component: ProductCreate,
    meta: { requiresAuth: true, requiresAdmin: true, hideHeader: true, hideFooter: true, hideFloatingButton: true}
  },
  {
    path: '/catalog/:categoryId',
    name: 'Catalog',
    component: CatalogProductListPage,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/product/:id',
    name: 'ProductPage',
    component: ProductPage,
    props: true,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/confirmation',
    name: 'ConfirmationPage',
    component: ConfirmationPage,
    meta: { hideHeader: true, hideFooter: true }
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
    meta: { hideHeader: true, hideFooter: false, guestOnly: true }
  },
  {
    path: '/succses', 
    name: 'SuccessPage',
    component: SuccessPage,
    meta: { hideHeader: true, hideFooter: true }
  },
  {
    path: '/',
    name: 'home', 
    component: HomePage,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritePage,
    meta: { hideHeader: false, hideFooter: false, requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
    meta: { hideHeader: true, hideFooter: false, guestOnly: true }
  },
  {
    path: '/order',
    name: 'order',
    component: OrderPage,
    meta: { hideHeader: false, hideFooter: false, requiresAuth: true }
  },
  {
    path: '/news',
    name: 'news',
    component: NewsPage,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: ContactsPage,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/paymentDelivery',
    name: 'paymentDelivery',
    component: PaymentDeliveryPage,
    meta: { hideHeader: false, hideFooter: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error404',
    component: Error404,
    meta: { hideHeader: false, hideFooter: false }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next(isAdmin ? { name: 'admin-dashboard' } : { name: 'home' });
  }

  if (to.meta.requiresAdmin && isAuthenticated && !isAdmin) {
    return next({ name: 'home' });
  }
  

  next();
});

app.use(router);
app.use(autoAnimatePlugin);
app.mount('#app');