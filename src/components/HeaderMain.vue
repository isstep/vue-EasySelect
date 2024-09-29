<script setup>
import { ref, onMounted, onUnmounted, watch, computed, inject } from 'vue'

const emit = defineEmits(['openDrawer', 'openCatalog', 'closeCatalog'])

const isSticky = ref(false)
const isCollapsed = ref(false)
const isCatalogOpen = ref(false)

const props = defineProps({
  totalPrice: Number
})

const { cartFood } = inject('cartFoodActions')

const NumberFoods = ref(0)

watch(cartFood, (newCartFood) => {
  NumberFoods.value = newCartFood.length
}, { immediate: true }) 


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
  'fixed top-0 left-0 w-full bg-white-800 backdrop-blur-md bg-opacity-70 z-40 transition-all duration-100 ease-in-out': true,
  'py-2 border-b': isSticky.value && isCollapsed.value,
  'py-1 border-none max-lg: h=[20px]': !isSticky.value
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
    <div
      v-if="!isCollapsed"
      class="flex items-center justify-between max-w-7xl mx-auto px-11 max-lg:hidden"
    >
      <span class="text-gray-500 flex items-center justify-between mb-1">
        <img class="h-[20px]" src="/123.svg" />
        <span class="text-blue-500 px-1">ул. Народная, 41</span>
        Сегодня, 10:50 - 12:50
      </span>
      <div class="flex mb-3 space-x-5 text-[16px]">
        <button class="text-gray-500 hover:text-customGreen">Доставка и оплата</button>
        <button class="text-gray-500 hover:text-customGreen">Контакты</button>
        <button class="text-gray-500 hover:text-customGreen">Доставка для юр. лиц</button>
        <button class="text-gray-500 hover:text-customGreen">Вакансии</button>
        <button class="text-gray-500 hover:text-customGreen">EasySelect.by</button>
      </div>
    </div>

    <div class="flex items-center justify-between max-w-7xl mx-auto px-11">
      <router-link to="/" class="flex items-center gap-4">
        <img src="/123123.png" alt="logo" class="w-[177px]" />
      </router-link>

      <div class="flex items-center gap-4 flex-grow">
        <button
          @click="toggleCatalog"
          class="ml-3 h-10 px-5 text-white bg-customGreen hover:bg-customGray rounded-full focus:outline-none transition-colors"
        >
          Каталог
        </button>

        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Поиск по товарам"
            class="w-full py-1 sm:py-2 pl-3 sm:pl-4 pr-8 sm:pr-12 text-gray-700 border border-green-500 rounded-full shadow-sm"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src="/search.svg" alt="search" class="w-5 h-5" />
          </span>
        </div>
      </div>

      <ul class="flex items-center gap-4 max-lg:hidden">
        <li>
          <router-link
            to="/login"
            class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-customGreen"
          >
            <img class="w-5 h-5 ml-4" src="/profile1.svg" alt="profile" />
            <span class="hidden md:block">Профиль</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/order"
            class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-customGreen"
          >
            <img class="w-5 h-5" src="/order.svg" alt="order" />
            <span class="hidden md:block">Заказы</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/favorites"
            class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-customGreen"
          >
            <img class="w-5 h-5" src="/heart1.svg" alt="heart" />
            <span class="hidden md:block">Избранное</span>
          </router-link>
        </li>

        <li
          @click="() => emit('openDrawer')"
          class="relative flex items-center cursor-pointer gap-2 text-gray-600 hover:text-customGreen"
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
      <div class="flex space-x-6 text-[15px] max-lg:hidden">
        <button class="text-black hover:text-customGreen">Акции</button>
        <button class="text-black hover:text-customGreen">Товары-везунчики</button>
        <button class="text-black hover:text-customGreen">Товары удачи</button>
        <button class="text-black hover:text-customGreen">Рецепты</button>
        <button class="text-black hover:text-customGreen">Veg</button>
        <button class="text-black hover:text-customGreen">Фрукты</button>
        <button class="text-black hover:text-customGreen">Сыр</button>
        <button class="text-black hover:text-customGreen">Говядина</button>
        <button class="text-black hover:text-customGreen">Индейка</button>
        <button class="text-black hover:text-customGreen">Подгузники</button>
        <button class="text-black hover:text-customGreen">Уход за лицом</button>
        <button class="text-black hover:text-customGreen">БАДы</button>
      </div>
    </div>
  </header>
</template>
