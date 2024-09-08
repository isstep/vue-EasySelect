<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])

const fetchOrders = async () => {
  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/orders')
    const data = await response.json()
    orders.value = data
  } catch (error) {
    console.error('Ошибка при получении заказов:', error)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="mt-20 max-w-7xl mx-auto px-4">
    <h2 class="text-3xl font-bold mb-8">Список заказов</h2>
    <div v-for="order in orders" :key="order.id" class="mb-10 bg-gray-100 p-6 rounded-lg shadow-lg">
      <h3 class="text-2xl font-semibold mb-4 text-gray-800">Заказ #{{ order.id }}</h3>
      <div class="flex overflow-x-auto space-x-6 pb-4">
        <div v-for="food in order.foods" :key="food.id">
          <img :src="food.imgUrl" :alt="food.title" class="w-30 h-20 object-cover rounded-md mb-4">
          <p class="text-gray-600 mt-2">Цена: <span class="text-blue-500 font-semibold">{{ food.price }} руб.</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

