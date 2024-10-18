<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import AuthModal from './AuthModal.vue';

const emit = defineEmits(['openDrawer', 'openCatalog', 'closeCatalog']);
const authStore = useAuthStore();
const router = useRouter();

const showAuthModal = ref(false);
const isSticky = ref(false);
const isCollapsed = ref(false);
const isCatalogOpen = ref(false);
const isDropdownOpen = ref(false);
const searchResults = ref([]);
const searchQuery = ref('');

const { cartFood } = inject('cartFoodActions');
const NumberFoods = computed(() => cartFood.value.length);

const handleScroll = () => {
  const scrollThreshold = 50;
  isSticky.value = window.scrollY > scrollThreshold;
  isCollapsed.value = window.scrollY > scrollThreshold + 10;
};

const toggleCatalog = () => {
  isCatalogOpen.value = !isCatalogOpen.value;
  emit(isCatalogOpen.value ? 'openCatalog' : 'closeCatalog');
};

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
    return;
  }
  emit('openDrawer');
};

const handleShowAuthModalOrder = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
  } else {
    router.push({ path: '/order' });
  }
};

const handleShowAuthModalFavorite = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
  } else {
    router.push({ path: '/favorites' });
  }
};

const handleLogout = () => {
  authStore.logout();
  isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
};

const onChangeSearchInput = async (event) => {
  searchQuery.value = event.target.value;

  if (searchQuery.value) {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/foods');
    const products = await response.json();
    const lowerCaseQuery = searchQuery.value.toLowerCase();

    searchResults.value = products.filter(product => {
      const productTitle = product.title.toLowerCase();
      return productTitle.includes(lowerCaseQuery);
    });
  } else {
    searchResults.value = [];
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    const firstResult = searchResults.value[0];
    if (firstResult) {
      router.push({ path: '/product', query: { id: firstResult.id } });
    }
  }
};

const headerClasses = computed(() => ({
  'fixed top-0 left-0 w-full bg-white backdrop-blur-md bg-opacity-80 z-40 transition-all duration-300 ease-in-out': true,
  'py-4 border-b border-gray-200': isSticky.value && isCollapsed.value,
  'py-1 border-none': !isSticky.value
}));

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <header :class="headerClasses">
    <div v-if="!isCollapsed" class="flex items-center justify-between max-w-7xl mx-auto px-11 max-lg:hidden">
      <span class="text-gray-500 flex items-center justify-between mb-1">
        <img class="h-5 transition-transform duration-300 hover:scale-105" src="/123.svg" alt="Location Icon" />
        <span class="text-blue-500 px-1">Укажите адрес</span>
        Сегодня, 10:00 - 21:00
      </span>
      <nav class="flex mb-3 space-x-5 text-[16px]">
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Доставка и оплата</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Контакты</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Доставка для юр. лиц</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Вакансии</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">EasySelect.by</button>
      </nav>
    </div>

    <div class="flex items-center justify-between max-w-7xl mx-auto px-11">
      <router-link to="/" class="flex items-center gap-4">
        <img src="/123123.png" alt="logo" class="w-[177px] transition-transform duration-300 ease-in-out hover:scale-105" />
      </router-link>

      <div class="flex items-center gap-4 flex-grow" @click="closeDropdown">
        <button
          @click="toggleCatalog"
          class="ml-3 h-10 px-5 text-white bg-green-600 hover:bg-gray-500 rounded-full focus:outline-none transition-colors duration-300 transform hover:scale-105"
        >
          Каталог
        </button>

        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Поиск по товарам"
            class="w-full py-2 pl-5 pr-8 text-gray-700 border border-green-300 rounded-full shadow-sm transition duration-300 focus:outline-none focus:ring-1 focus:ring-green-300"
            @input="onChangeSearchInput"
            @keydown="handleKeyDown"
            @focus="isDropdownOpen = true"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src="/search.svg" alt="search" class="w-5 h-5" />
          </span>

          <ul v-if="isDropdownOpen && searchResults.length" class="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
            <li
              v-for="result in searchResults"
              :key="result.id"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @click="router.push({ path: '/product', query: { id: result.id } })"
            >
              {{ result.title }}
            </li>
          </ul>
        </div>
      </div>

      <ul class="flex items-center gap-4 max-lg:hidden">
        <li v-if="authStore.isAuthenticated" class="relative flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105" @click="toggleDropdown">
          <img class="w-5 h-5 ml-4" src="/profile1.svg" alt="profile" />
          <span class="hidden md:block">{{ authStore.user ? authStore.user.name : 'Ошибка' }}</span>
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
            <div class="p-4">
              <p class="font-semibold">{{ authStore.user ? authStore.user.name : 'Ошибка' }}</p>
              <p class="text-sm text-gray-500">{{ authStore.user ? authStore.user.email : 'Ошибка' }}</p>
            </div>
            <button @click="handleLogout" class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 transition duration-300">Выйти</button>
          </div>
        </li>

        <li v-else>
          <router-link to="/login" class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
            <img class="w-5 h-5 ml-4" src="/profile1.svg" alt="profile" />
            <span class="hidden md:block">Профиль</span>
          </router-link>
        </li>

        <li @click="handleShowAuthModalOrder" class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
          <img class="w-5 h-5" src="/order.svg" alt="order" />
          <span class="hidden md:block">Заказы</span>
        </li>

        <li @click="handleShowAuthModalFavorite" class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
          <img class="w-5 h-5" src="/heart1.svg" alt="heart" />
          <span class="hidden md:block">Избранное</span>
        </li>

        <li @click="handleAddToCart" class="relative flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
          <span class="absolute mb-4 ml-3 w-3 h-3 flex items-center justify-center text-[0.6em] leading-none text-red-100 bg-red-600 rounded-full animate-bounce">
            {{ NumberFoods }}
          </span>
          <img class="w-5 h-5" src="/cart.svg" alt="cart" />
          <span class="hidden md:block">Корзина</span>
        </li>
      </ul>
    </div>

    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </header>
</template>

<style scoped>
.headerClasses {
  transition: all 0.3s ease-in-out;
}

.sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #eaeaea;
  transition: padding 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
}

.non-sticky {
  position: static;
  padding: 1rem 0;
}
</style>
