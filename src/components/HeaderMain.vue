<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['openDrawer', 'openCatalog', 'closeCatalog']);
const authStore = useAuthStore();
const isSticky = ref(false);
const isCollapsed = ref(false);
const isCatalogOpen = ref(false);
const isDropdownOpen = ref(false);

const props = defineProps({
  totalPrice: Number
});

const { cartFood } = inject('cartFoodActions');

const NumberFoods = computed(() => cartFood.value.length);

const filters = inject('filters');

const handleScroll = () => {
  const scrollThreshold = 50;
  isSticky.value = window.scrollY > scrollThreshold;
  isCollapsed.value = window.scrollY > scrollThreshold + 10;
};

const toggleCatalog = () => {
  if (!authStore.isAuthenticated) {
    alert('Вам нужно авторизоваться, чтобы открыть каталог');
    return;
  }
  isCatalogOpen.value = !isCatalogOpen.value;
  emit(isCatalogOpen.value ? 'openCatalog' : 'closeCatalog');
};

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    alert('Вам нужно авторизоваться, чтобы добавить товар в корзину');
    return;
  }
  emit('openDrawer');
};

const handleLogout = () => {
  authStore.logout(); 
  isDropdownOpen.value = false; 
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const headerClasses = computed(() => ({
  'fixed top-0 left-0 w-full bg-white backdrop-blur-md bg-opacity-80 z-40 transition-all duration-300 ease-in-out': true,
  'py-4 border-b border-gray-200': isSticky.value && isCollapsed.value,
  'py-1 border-none': !isSticky.value
}));

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header :class="headerClasses">
    <div v-if="!isCollapsed" class="flex items-center justify-between max-w-7xl mx-auto px-11 max-lg:hidden">
      <span class="text-gray-500 flex items-center justify-between mb-1">
        <img class="h-[20px] transition-transform duration-300 hover:scale-105" src="/123.svg" />
        <span class="text-blue-500 px-1">ул. Пушкина, 41</span>
        Сегодня, 10:50 - 12:50
      </span>
      <div class="flex mb-3 space-x-5 text-[16px]">
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Доставка и оплата</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Контакты</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Доставка для юр. лиц</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">Вакансии</button>
        <button class="text-gray-500 hover:text-green-600 transition duration-300">EasySelect.by</button>
      </div>
    </div>

    <div class="flex items-center justify-between max-w-7xl mx-auto px-11">
      <router-link to="/" class="flex items-center gap-4">
        <img src="/123123.png" alt="logo" class="w-[177px] transition-transform duration-300 ease-in-out hover:scale-105" />
      </router-link>

      <div class="flex items-center gap-4 flex-grow">
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
            class="w-full py-2 pl-5 pr-8 text-gray-700 border border-green-500 rounded-full shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            @input="onChangeSearchInput"  
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src="/search.svg" alt="search" class="w-5 h-5" />
          </span>
        </div>
      </div>

      <ul class="flex items-center gap-4 max-lg:hidden">
        <li v-if="authStore.isAuthenticated" class="relative flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105" @click="toggleDropdown">
          <img class="w-5 h-5 ml-4" src="/profile1.svg" alt="profile" />
          <span class="hidden md:block">{{ authStore.user ? authStore.user.name : 'Имя пользователя' }}</span>
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
            <div class="p-4">
              <p class="font-semibold">{{ authStore.user ? authStore.user.name : 'Имя пользователя' }}</p>
              <p class="text-sm text-gray-500">{{ authStore.user ? authStore.user.email : 'email@example.com' }}</p>
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

        <li>
          <router-link to="/order" class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
            <img class="w-5 h-5" src="/order.svg" alt="order" />
            <span class="hidden md:block">Заказы</span>
          </router-link>
        </li>

        <li>
          <router-link to="/favorites" class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
            <img class="w-5 h-5" src="/heart1.svg" alt="heart" />
            <span class="hidden md:block">Избранное</span>
          </router-link>
        </li>

        <li @click="handleAddToCart" class="relative flex items-center cursor-pointer gap-2 text-gray-600 hover:text-green-600 transition duration-300 transform hover:scale-105">
          <span class="absolute mb-4 ml-3 w-3 h-3 flex items-center justify-center text-[0.6em] leading-none text-red-100 bg-red-600 rounded-full animate-bounce">
            {{ NumberFoods }}
          </span>
          <img class="w-5 h-5" src="/cart1.svg" alt="cart" />
          <b class="hidden md:block">{{ props.totalPrice !== null ? props.totalPrice.toFixed(2) : '0.00' }} руб.</b>
        </li>
      </ul>
    </div>

    <div v-if="!isCollapsed && !isCatalogOpen" class="flex items-center justify-between max-w-7xl mx-auto px-11 p-[0.6em]">
      <div class="flex space-x-6 text-[15px] max-lg:hidden">
        <button class="text-black hover:text-customGreen">Акции</button>
        <button class="text-black hover:text-customGreen">Товары-везунчики</button>
        <button class="text-black hover:text-customGreen">Товары удачи</button>
        <button class="text-black hover:text-customGreen">Рецепты</button>
        <button class="text-black hover:text-customGreen">Veg</button>
        <button class="text-black hover:text-customGreen">Фрукты</button>
        <button class="text-black hover:text-customGreen">Сыр</button>
        <button class="text-black hover:text-customGreen">Говядина</button>
        <button class="text-black hover:text-customGreen">Курица</button>
      </div>
    </div>
  </header>
</template>
