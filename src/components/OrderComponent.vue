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

const calculateTotal = (foods) => {
  return foods.reduce((total, food) => total + food.price, 0)
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="mt-20 max-w-7xl mx-auto px-4">
    <h2 class="text-3xl font-bold mb-8">Список заказов</h2>

    <div
      v-for="order in orders"
      :key="order.id"
      class="mb-10 bg-white-100 p-6 rounded-lg shadow-md hover:shadow-md border"
    >
      <div class="flex items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800 mr-4">
          Доставка 06 сентября, 17:00 - 19:00
        </h2>
        <div class="flex items-center gap-3">
          <span class="text-sm"> Ожидается</span>
          <span class="text-sm text-gray-500"> Народная, 45</span>
          <span class="ml-2 text-sm text-gray-500">{{ calculateTotal(order.foods) }},40 р.</span>
        </div>
      </div>

      <div class="flex overflow-x-auto space-x-6 pb-4">
        <div v-for="food in order.foods.slice(0, 10)" :key="food.id">
          <img
            :src="food.imgUrl"
            :alt="food.title"
            class="w-30 h-20 object-cover rounded-md mb-4"
          />
        </div>
      </div>

      <button
        class="mt-4 bg-gray-400 text-white py-2 px-6 rounded-xl shadow-lg hover:bg-gray-200 hover:text-black hover:shadow transition duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-100"
      >
        <img class="w-5 h-5" src="/repeat.svg" alt="Повторить" />
        <span>Повторить заказ</span>
      </button>
    </div>
  </div>
</template>
