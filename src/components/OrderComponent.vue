<script setup>
import { ref, onMounted } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const orders = ref([])

const fetchOrders = async () => {
  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/orders')
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    orders.value = data
  } catch (error) {
    console.error('Ошибка при получении заказов:', error)
  }
}

onMounted(fetchOrders)

const settings = {
  itemsToShow: 1,
  snapAlign: 'center'
}

const breakpoints = {
  700: {
    itemsToShow: 3.5,
    snapAlign: 'center'
  },
  1024: {
    itemsToShow: 5,
    snapAlign: 'start'
  }
}
</script>

<template>
  <div class="mt-20 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold mb-8">Список заказов</h2>

    <div v-for="order in orders" :key="order.id" class="mb-10">
      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-md border">
        <div class="flex items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800 mr-4">
            Доставка 06 сентября, 17:00 - 19:00
          </h2>
          <div class="flex items-center gap-3">
            <span class="text-sm">Ожидается</span>
            <span class="text-sm text-gray-500">Пушкина, 41</span>
            <span class="ml-2 text-sm text-gray-500">{{ order.totalPrice?.toFixed(2) }} р.</span>
          </div>
        </div>

        <Carousel v-bind="settings" :breakpoints="breakpoints">
          <Slide v-for="food in order.foods.slice(0, 10)" :key="food.id">
            <a :href="`/product/${food.id}`">
            <div
              class="h-[18em] bg-white border border-gray-100 rounded-lg shadow mr-1  p-4 mb-1 hover:border-gray-300 transition-shadow "
            >
                <img
                  v-if="food.imgUrl"
                  :src="food.imgUrl"
                  :alt="food.title"
                  class="object-cover rounded-md mb-2"
                />
                <p class="text-center text-[10px] font-semibold">{{ food.title }}</p>
                <p class="text-center text-sm text-gray-500">{{ food.price?.toFixed(2) }} р.</p>
              
            </div>
          </a>
          </Slide>

          <template #addons>
            <Navigation />
          </template>
        </Carousel>

        <button
          class="mt-4 bg-gray-400 text-white py-2 px-6 rounded-xl shadow-lg hover:bg-gray-200 hover:text-black hover:shadow transition duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-100"
        >
          <img class="w-5 h-5" src="/repeat.svg" alt="Повторить" />
          <span>Повторить заказ</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
