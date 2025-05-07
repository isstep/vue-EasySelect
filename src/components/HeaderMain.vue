<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AuthModal from './AuthModal.vue'

const emit = defineEmits(['openDrawer', 'openCatalog', 'closeCatalog'])
  const authStore = useAuthStore()
const router = useRouter()
const showAuthModal = ref(false)
const isSticky = ref(false)
const isCollapsed = ref(false)
const isCatalogOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const isSearchDropdownOpen = ref(false)
const searchResults = ref([])
const searchQuery = ref('')
const UserName = localStorage.getItem('UserName');

const profileMenuTrigger = ref(null)
const profileMenuDropdown = ref(null)
const searchInputContainer = ref(null)

const { cartFood } = inject('cartFoodActions')
const NumberFoods = computed(() => cartFood.value?.length || 0)

const userDisplayName = computed(() => {
  if (authStore.isAuthenticated && authStore.user) {
    return UserName;
  }
  return 'Войти';
})

const handleScroll = () => {
  const scrollThreshold = 50
  const collapseThreshold = scrollThreshold + 10
  isSticky.value = window.scrollY > scrollThreshold
  isCollapsed.value = window.scrollY > collapseThreshold
}

const toggleCatalog = () => {
  isCatalogOpen.value = !isCatalogOpen.value
  emit(isCatalogOpen.value ? 'openCatalog' : 'closeCatalog')
}

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }
  emit('openDrawer')
}

const handleAuthenticatedAction = (path) => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
  } else {
    router.push({ path })
  }
}

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeProfileDropdown()
  router.push('/')
}

const onChangeSearchInput = async (event) => {
  searchQuery.value = event.target.value
  if (searchQuery.value.trim()) {
    isSearchDropdownOpen.value = true
    try {
      const response = await fetch(
        `https://f4f1d0c1ac4cb845.mokky.dev/foods?title=*${searchQuery.value}*`
      )
      if (!response.ok) throw new Error('Network response was not ok')
      const products = await response.json()
      searchResults.value = products
    } catch (error) {
      console.error('Error fetching search results:', error)
      searchResults.value = []
    }
  } else {
    searchResults.value = []
    isSearchDropdownOpen.value = false
  }
}

const handleSearchKeyDown = (event) => {
  if (event.key === 'Enter' && searchResults.value.length > 0) {
    goToProductPage(searchResults.value[0].id)
  }
}

const goToProductPage = (id) => {
  searchQuery.value = ''
  searchResults.value = []
  isSearchDropdownOpen.value = false
  router.push({ name: 'ProductPage', params: { id } })
}

const handleClickOutside = (event) => {
  if (
    isProfileDropdownOpen.value &&
    profileMenuTrigger.value &&
    !profileMenuTrigger.value.contains(event.target) &&
    profileMenuDropdown.value &&
    !profileMenuDropdown.value.contains(event.target)
  ) {
    closeProfileDropdown()
  }
  if (
    isSearchDropdownOpen.value &&
    searchInputContainer.value &&
    !searchInputContainer.value.contains(event.target)
  ) {
    isSearchDropdownOpen.value = false
  }
}

const headerClasses = computed(() => ({
  'fixed top-0 left-0 w-full bg-white z-40 transition-all duration-300 ease-in-out': true,
  ' backdrop-blur-sm bg-white/90': isSticky.value,
  ' border-b': !isSticky.value,
  'py-2 border-b border-gray-200': isSticky.value
}))

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

watch(router.currentRoute, () => {
  if (isCatalogOpen.value) {
    isCatalogOpen.value = false
    emit('closeCatalog')
  }
})
</script>

<template>
  <header :class="headerClasses">
    <div
      v-if="!isCollapsed"
      class="bg-gray-50 border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden max-lg:hidden"
      :class="{
        'max-h-0 opacity-0 border-none': isCollapsed,
        'max-h-10 opacity-100 py-1': !isCollapsed
      }"
    >
      <div class="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm">
        <span class="text-gray-600 flex items-center gap-2">
          <img class="h-4 w-4" src="/123.svg" alt="Location" />
          <span class="text-blue-600 font-medium hover:underline cursor-pointer"
            >Укажите адрес</span
          >
          <span class="text-gray-500">Сегодня, 10:00 - 21:00</span>
        </span>
        <nav class="flex items-center space-x-4 text-gray-600">
          <a href="/paymentDelivery" class="hover:text-emerald-600 transition-colors">Доставка и оплата</a>
          <a href="/news" class="hover:text-emerald-600 transition-colors">Новости</a>

          <a href="/contacts" class="hover:text-emerald-600 transition-colors">Контакты</a>
          <a href="/about" class="hover:text-emerald-600 transition-colors">EasySelect</a>

        </nav>
      </div>
    </div>

    <div class="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
      <router-link to="/" class="flex-shrink-0 flex items-center">
        <img
          src="/123123.png"
          alt="logo"
          class="block h-8 w-auto lg:h-9 transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </router-link>

      <div class="flex items-center gap-4 flex-grow mx-4 lg:mx-8">
        <button
          @click="toggleCatalog"
          class="hidden lg:flex items-center justify-center gap-2 h-10 px-5 text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg focus:outline-none focus:ring-offset-1 transition-all duration-300 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Каталог
        </button>

        <div ref="searchInputContainer" class="relative flex-grow max-w-lg">
          <input
            type="text"
            :value="searchQuery"
            placeholder="Поиск по товарам..."
            class="w-full h-10 px-4 pr-10 text-gray-700 border border-gray-300 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:border-emerald-500 placeholder-gray-400"
            @input="onChangeSearchInput"
            @keydown="handleSearchKeyDown"
            @focus="isSearchDropdownOpen = !!searchQuery"
            autocomplete="off"
          />
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none"
          >
            <img src="/search.svg" alt="search" class="w-5 h-5" />
          </span>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <ul
              v-if="isSearchDropdownOpen && searchResults.length > 0"
              class="absolute left-0 right-0 w-full bg-white border border-gray-200 rounded-md mt-1 z-20 max-h-80 overflow-y-auto shadow-lg py-1"
            >
              <li
                v-for="result in searchResults"
                :key="result.id"
                class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer transition duration-150 ease-in-out"
                @mousedown.prevent="goToProductPage(result.id)"
              >
                <img
                  :src="result.imgUrl || '/placeholder-image.svg'"
                  alt=""
                  class="w-8 h-8 rounded object-cover mr-3 flex-shrink-0"
                />
                <span class="truncate">{{ result.title }}</span>
              </li>
            </ul>
            <div
              v-else-if="isSearchDropdownOpen && searchQuery && !searchResults.length"
              class="absolute left-0 right-0 w-full bg-white border border-gray-200 rounded-md mt-1 z-20 shadow-lg p-3 text-sm text-gray-500 text-center"
            >
              Ничего не найдено
            </div>
          </transition>
        </div>
      </div>

      <nav class="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
        <div class="relative">
          <button
            ref="profileMenuTrigger"
            @click="authStore.isAuthenticated ? toggleProfileDropdown() : router.push('/login')"
            class="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-offset-1 rounded-md p-1 -m-1"
            :aria-expanded="isProfileDropdownOpen"
            aria-haspopup="true"
          >
            <img class="w-6 h-6" src="/profile1.svg" alt="profile" />
            <span> {{}}</span>
            <span class="hidden lg:inline text-sm font-medium">{{ userDisplayName }}</span>
            <svg
              v-if="authStore.isAuthenticated"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400 hidden lg:inline ml-1 transition-transform duration-200"
              :class="{ 'rotate-180': isProfileDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isProfileDropdownOpen"
              ref="profileMenuDropdown"
              class="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <div class="px-4 py-2 border-b border-gray-100" v-if="authStore.user">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ authStore.user.firstName || '' }} {{ authStore.user.lastName || '' }}
                </p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.user.email }}</p>
              </div>

              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                >Настройки</a
              >
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 ease-in-out"
                role="menuitem"
                tabindex="-1"
              >
                Выйти
              </button>
            </div>
          </transition>
        </div>

        <button
          @click="handleAuthenticatedAction('/order')"
          class="flex items-center flex-col text-gray-600 hover:text-emerald-600 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-offset-1 rounded-md p-1 -m-1"
          title="Заказы"
        >
          <img class="w-6 h-6" src="/order.svg" alt="order" />
          <span class="hidden lg:inline text-xs mt-0.5">Заказы</span>
        </button>

        <button
          @click="handleAuthenticatedAction('/favorites')"
          class="flex items-center flex-col text-gray-600 hover:text-emerald-600 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-offset-1 rounded-md p-1 -m-1"
          title="Избранное"
        >
          <img class="w-6 h-6" src="/heart1.svg" alt="heart" />
          <span class="hidden lg:inline text-xs mt-0.5">Избранное</span>
        </button>

        <button
          @click="handleAddToCart"
          class="relative flex items-center flex-col text-gray-600 hover:text-emerald-600 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-offset-1 rounded-md p-1 -m-1"
          title="Корзина"
        >
          <img class="w-6 h-6" src="/cart1.svg" alt="cart" />
          <span class="hidden lg:inline text-xs mt-0.5">Корзина</span>
          <span
            v-if="NumberFoods > 0"
            class="absolute -top-1 -right-1.5 w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold leading-none text-white bg-red-600 rounded-full"
            :class="{ 'animate-pulse': NumberFoods > 0 }"
          >
            {{ NumberFoods }}
          </span>
        </button>

        <button
          class="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-inset"
        >
          <span class="sr-only">Открыть меню</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>
    </div>

    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </header>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid theme('colors.emerald.500');
  outline-offset: 2px;
}
input:focus-visible {
  outline: none;
}
::placeholder {
  color: theme('colors.gray.400');
  opacity: 1;
}
:-ms-input-placeholder {
  color: theme('colors.gray.400');
}
::-ms-input-placeholder {
  color: theme('colors.gray.400');
}
</style>
