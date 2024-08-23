<script setup>
import { computed, onMounted, watch } from 'vue'
import { useMainStore } from '../store'
import CardList from '../components/CardList.vue'
import Carouse from '../components/Carouse.vue'

const store = useMainStore()

const foods = computed(() => store.sortedFoods)

const addPlusToCartFood = (food) => {
  if (!food.isAdded) {
    store.addFoodToCart(food)
  } else {
    store.removeFoodFromCart(food.id)
  }
  localStorage.setItem('cartFood', JSON.stringify(store.cartFood))
}

const onChangeSelect = (event) => {
  store.filters.sortBy = event.target.value
  store.fetchFoods()
}


const addToFavorite = async (food) => {
  await store.toggleFavorite(food)
}

onMounted(async () => {
  store.loadCartFromLocalStorage()
  await store.fetchFoods()
  await store.fetchFavorites()
})

watch(
  () => store.cartFood,
  () => {
    store.foods = store.foods.map((food) => ({
      ...food,
      isAdded: store.cartFood.some((cartItemFood) => cartItemFood.id === food.id)
    }))
  }
)

watch(
  () => store.filters,
  () => {
    store.fetchFoods()
  }
)
</script>

<template>
  <div class="mt-20">
    <div class="max-[768px]:hidden">
      <Carouse />
    </div>
    <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-0">Вся еда</h2>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <select
          @change="onChangeSelect"
          class="py-2 px-3 border border-gray-300 rounded-md outline-none text-sm sm:text-base focus:ring focus:ring-gray-300"
        >
          <option value="title">По названию</option>
          <option value="price">По цене (дешевые)</option>
          <option value="-price">По цене (дорогие)</option>
        </select>

      
      </div>
    </div>
    <div class="mt-5">
      <CardList
        :foods="foods"
        @add-to-favorite="addToFavorite"
        @add-plus-to-cart-food="addPlusToCartFood"
      />
    </div>
  </div>
</template>
