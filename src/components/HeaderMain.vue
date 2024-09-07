<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['openDrawer','openCatalog'])

const isSticky = ref(false)
const isCollapsed = ref(false)

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

defineProps({
  totalPrice: Number
})
</script>


<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full bg-white border-b border-slate-300 z-40 transition-all duration-300 ease-in-out',
      isSticky ? (isCollapsed ? 'py-2 h-[60px]' : 'py-4 h-[80px]') : 'py-4 h-[80px]'
    ]"
  >
    <div class="container mx-auto flex items-center justify-between h-full px-4 md:px-8 lg:px-44">
 
      <router-link to="/" class="flex items-center gap-4">
        <img src="/logo.svg" alt="logo" class="w-12" />
        <div v-if="!isCollapsed" class="hidden md:block">
          <h2 class="text-2xl font-bold">CosmoExpress</h2>
          <p class="text-slate-400">Еда, которая прилетает к вам!</p>
        </div>
      </router-link>


      <div class="flex items-center gap-4 flex-grow mx-4">
     
        <button
          @click="() => emit('openCatalog')"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Каталог
        </button>

 
        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Поиск по товарам"
            class="w-full py-2 pl-4 pr-10 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src="/search.svg" alt="search" />
          </span>
        </div>
      </div>

    
      <ul class="flex items-center gap-6 md:gap-10">
      
        <li
          @click="() => emit('openDrawer')"
          class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
        >
          <img src="/cart.svg" alt="cart" />
          <b class="hidden md:block">{{ totalPrice }} руб.</b>
        </li>

        <li>
          <router-link to="/favorites" class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
            <img src="/heart.svg" alt="heart" />
            <span class="hidden md:block">Избранное</span>
          </router-link>
        </li>

   
        <li>
          <router-link to="/login" class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
            <img src="/profile.svg" alt="profile" />
            <span class="hidden md:block">Профиль</span>
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>