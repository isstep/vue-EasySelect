<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const emit = defineEmits(['openDrawer', 'openCatalog', 'closeCatalog'])

const isSticky = ref(false)
const isCollapsed = ref(false)
const isCatalogOpen = ref(false)

const props = defineProps({
  totalPrice: Number
})

const previousPrice = ref(0)
const NumberFoods = ref(0)

watch(
  () => props.totalPrice,
  (newValue) => {
    if (newValue === 0) {
      NumberFoods.value = 0
    } else {
      const priceDifference = newValue - previousPrice.value
      NumberFoods.value += Math.sign(priceDifference)
      previousPrice.value = newValue
    }
  }
)

const handleScroll = () => {
  const scrollThreshold = 50
  isSticky.value = window.scrollY > scrollThreshold
  isCollapsed.value = window.scrollY > scrollThreshold + 10
}

const toggleCatalog = () => {
  isCatalogOpen.value = !isCatalogOpen.value
  if (isCatalogOpen.value) {
    emit('openCatalog')
  } else {
    emit('closeCatalog')
  }
}

const headerClasses = computed(() => ({
  'fixed top-0 left-0 w-full bg-white z-40 transition-all duration-100 ease-in-out': true,
  'py-2 h-[55px] border-b': isSticky.value && isCollapsed.value,
  'py-1 h-[130px] border-none': !isSticky.value
}))

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="headerClasses">
    <div v-if="!isCollapsed" class="flex items-center justify-between max-w-7xl mx-auto px-11 mb-3">
      <span class="text-gray-500 flex items-center justify-between">
        <img class="h-[20px]" src="/123d.svg" />
        <span class="text-blue-500 px-1">ул. Народная, 41</span>
        Сегодня, 10:50 - 12:50
      </span>
      <div class="flex space-x-5 text-[16px]">
        <button class="text-gray-500">Доставка и оплата</button>
        <button class="text-gray-500">Контакты</button>
        <button class="text-gray-500">Доставка для юр. лиц</button>
        <button class="text-gray-500">Вакансии</button>
        <button class="text-gray-500">Cosmo.by</button>
      </div>
    </div>

    <div class="flex items-center justify-between max-w-7xl mx-auto px-11">
      <router-link to="/" class="flex items-center gap-4">
        <img src="/logo.svg" alt="logo" class="w-10 h-10" />
        <div v-if="!isCollapsed" class="hidden md:block">
          <h2 class="text-2xl font-semibold text-gray-800">CosmoExpress</h2>
        </div>
      </router-link>

      <div class="flex items-center gap-4 flex-grow">
        <button
          @click="toggleCatalog"
          class="ml-3 h-10 px-5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
        >
          Каталог
        </button>

        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Поиск по товарам"
            class="w-full py-1 sm:py-2 pl-3 sm:pl-4 pr-8 sm:pr-12 text-gray-700 border border-gray-200 rounded-full shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src="/search.svg" alt="search" class="w-5 h-5" />
          </span>
        </div>
      </div>

      <ul class="flex items-center gap-4">
        <li>
          <router-link
            to="/login"
            class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-indigo-600"
          >
            <img class="w-5 h-5 ml-4" src="/profile1.svg" alt="profile" />
            <span class="hidden md:block">Профиль</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/order"
            class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-indigo-600"
          >
            <img class="w-5 h-5" src="/order.svg" alt="order" />
            <span class="hidden md:block">Заказы</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/favorites"
            class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-indigo-600"
          >
            <img class="w-5 h-5" src="/heart1.svg" alt="heart" />
            <span class="hidden md:block">Избранное</span>
          </router-link>
        </li>

        <li
          @click="() => emit('openDrawer')"
          class="relative flex items-center cursor-pointer gap-2 text-gray-600 hover:text-indigo-600"
        >
          <span
            class="absolute mb-4 ml-3 w-3 h-3 flex items-center justify-center text-[0.6em] leading-none text-red-100 bg-red-600 rounded-full"
          >
            {{ NumberFoods }}
          </span>
          <img class="w-5 h-5" src="/cart1.svg" alt="cart" />
          <b class="hidden md:block"
            >{{ props.totalPrice === 0 ? '0' : props.totalPrice.toFixed(2) }} руб.</b
          >
        </li>
      </ul>
    </div>

    <div
      v-if="!isCollapsed"
      class="flex items-center justify-between max-w-7xl mx-auto px-11 p-[0.6em]"
    >
      <div class="flex space-x-6 text-[15px]">
        <button class="text-black">Акции</button>
        <button class="text-black">Товары-везунчики</button>
        <button class="text-black">Товары удачи</button>
        <button class="text-black">Рецепты</button>
        <button class="text-black">Veg</button>
        <button class="text-black">Фрукты</button>
        <button class="text-black">Сыр</button>
        <button class="text-black">Говядина</button>
        <button class="text-black">Индейка</button>
        <button class="text-black">Подгузники</button>
        <button class="text-black">Уход за лицом</button>
        <button class="text-black">БАДы</button>
      </div>
    </div>
  </header>
</template>
