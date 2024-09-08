<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const emit = defineEmits(['openDrawer', 'openCatalog', 'closeCatalog'])

const isSticky = ref(false)
const isCollapsed = ref(false)
const isCatalogOpen = ref(false)
const NumberFoods = ref(0)

const props = defineProps({
  totalPrice: Number
})

let previousPrice = 0;
watch(() => props.totalPrice, (newValue) => {
  if (newValue > previousPrice) {
    NumberFoods.value += 1;
  } else if (newValue < previousPrice) {
    NumberFoods.value -= 1;
  }
  previousPrice = newValue;
});

const handleScroll = () => {
  const scrollThreshold = 50
  isSticky.value = window.scrollY > scrollThreshold
  isCollapsed.value = window.scrollY > scrollThreshold + 50
}

const toggleCatalog = () => {
  isCatalogOpen.value = !isCatalogOpen.value
  if (isCatalogOpen.value) {
    emit('openCatalog')
  } else {
    emit('closeCatalog')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full bg-white border-slate-300 z-40 transition-all duration-300 ease-in-out',
      isSticky
        ? isCollapsed
          ? 'py-2 h-[60px] border-b'
          : 'py-3 h-[60px] border-b'
        : 'py-4 h-[80px] '
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
          @click="toggleCatalog"
          class="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800"
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

      <ul class="flex items-center gap-4 md:gap-4">
        <li>
          <router-link
            to="/login"
            class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
          >
            <img class="w-5" src="/profile1.svg" alt="profile" />
            <span class="hidden md:block">Профиль</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/order"
            class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
          >
            <img class="w-5" src="/order.svg" alt="order" />
            <span class="hidden md:block">Заказы</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/favorites"
            class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
          >
            <img class="w-5" src="/heart1.svg" alt="heart" />
            <span class="hidden md:block">Избранное</span>
          </router-link>
        </li>

        <li
          @click="() => emit('openDrawer')"
          class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
        >
          <span
            class="absolute mb-4 ml-3 w-3 h-3 inline-flex items-center justify-center mr-2 text-[0.6em] leading-none text-red-100 bg-red-600 rounded-full"
          >
            {{ NumberFoods }}</span
          >

          <img class="w-5" src="/cart1.svg" alt="cart" />
          <b class="hidden md:block">{{ totalPrice }} руб.</b>
        </li>
      </ul>
    </div>
  </header>
</template>
