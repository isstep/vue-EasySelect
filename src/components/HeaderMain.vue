<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMainStore } from '../store'

const emit = defineEmits(['openDrawer'])
const isSticky = ref(false)
const isCollapsed = ref(false)

const store = useMainStore()

const handleScroll = () => {
  const scrollThreshold = 50
  isSticky.value = window.scrollY > scrollThreshold
  isCollapsed.value = window.scrollY > scrollThreshold + 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const onSearchInput = (event) => {
  store.setSearchQuery(event.target.value)
}

defineProps({
  totalPrice: Number
})
</script>

<template>
  <header
    :class="[
      'transition-all duration-300 ease-in-out fixed top-0 left-0 w-full bg-white border-b border-slate-300 z-40',
      isSticky ? (isCollapsed ? 'py-2' : 'py-4') : 'py-4',
      isCollapsed ? 'shadow-none' : 'shadow-lg'
    ]"
    :style="{
      height: isSticky ? (isCollapsed ? '60px' : '80px') : '80px',
      overflow: 'hidden'
    }"
  >
    <div
      class="container mx-auto flex items-center justify-between h-full px-[11em] max-[1400px]:px-[3em] max-[1284px]:px-[0em]  max-[1024px]:px-[3em]"
    >
      <router-link to="/" class="flex items-center gap-5">
        <img src="/logo.svg" alt="logo" class="w-12" />
        <div v-if="!isCollapsed">
          <h2 class="text-2xl font-bold max-[768px]:hidden">CosmoExpress</h2>
          <p class="text-slate-400 max-[768px]:hidden">Еда, которая прилетает к вам!</p>
        </div>
      </router-link>
      <div class="relative">
        <img class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" src="/search.svg" />
        <input
          v-model="store.filters.searchQuery"
          class="border border-gray-300 rounded-md py-2 pl-9 pr-[20em] outline-none text-sm sm:text-base focus:border-gray-400 focus:ring focus:ring-gray-300"
          type="text"
          placeholder="Поиск..."
          @input="onSearchInput"
        />
      </div>
      <ul class="flex items-center gap-10 gap-3">
        <li
          @click="() => emit('openDrawer')"
          class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
        >
          <img src="/cart.svg" alt="cart" />
          <b class="max-[768px]:hidden">{{ totalPrice }} руб.</b>
        </li>
        <router-link to="/favorites">
          <li class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
            <img src="/heart.svg" alt="heart" />
            <span class="max-[768px]:hidden">Избранное</span>
          </li>
        </router-link>

        <li class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
          <img src="/profile.svg" alt="profile" />
          <span class="max-[768px]:hidden">Профиль</span>
        </li>
      </ul>
    
    </div>
  </header>
</template>
