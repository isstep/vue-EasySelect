<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { inject } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'
import Carouse from '../components/Carouse.vue'

const { cartFood, addFoodToCart, removeFoodFromCart } = inject('cartFoodActions')

const foods = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const addPlusToCartFood = (food) => {
  if (!food.isAdded) {
    addFoodToCart(food)
  } else {
    removeFoodFromCart(food)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
}

const addToFavorite = async (food) => {
  try {
    if (!food.isFavorite) {
      const obj = {
        parentId: food.id
      }
      food.isFavorite = true
      const { data } = await axios.post('https://f4f1d0c1ac4cb845.mokky.dev/favorites', obj)
      food.favoriteId = data.id
    } else {
      food.isFavorite = false
      await axios.delete(`https://f4f1d0c1ac4cb845.mokky.dev/favorites/${food.favoriteId}`)
      food.favoriteId = null
    }
  } catch (err) {
    console.log(err)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://f4f1d0c1ac4cb845.mokky.dev/favorites')

    foods.value = foods.value.map((food) => {
      const favorite = favorites.find((favorite) => favorite.parentId === food.id)

      if (!favorite) {
        return food
      }

      return {
        ...food,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (err) {
    console.log(err)
  }
}

const fetchFoods = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }
    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }
    const { data } = await axios.get('https://f4f1d0c1ac4cb845.mokky.dev/foods', {
      params
    })

    foods.value = data.map((obg) => ({
      ...obg,
      isFavorite: false,
      isAdded: false,
      favoriteId: null
    }))
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  const localCartFood = localStorage.getItem('cartFood')
  cartFood.value = localCartFood ? JSON.parse(localCartFood) : []

  await fetchFoods()
  await fetchFavorites()

  foods.value = foods.value.map((food) => ({
    ...food,
    isAdded: cartFood.value.some((cartItemFood) => cartItemFood.id === food.id)
  }))
})

watch(cartFood, () => {
  foods.value = foods.value.map((food) => ({
    ...food,
    isAdded: false
  }))
})

watch(filters, fetchFoods)
</script>

<template>
<div class="mb-[5em]">
<Carouse />
</div>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Вся еда</h2>

    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="title">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price ">По цене (дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-3 top-3" src="/search.svg" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-9 pr-4 outline-none focus:border-gray-400"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>
  <div class="mt-5">
    <CardList
      :foods="foods"
      @add-to-favorite="addToFavorite"
      @add-plus-to-cart-food="addPlusToCartFood"
    />
  </div>
</template>