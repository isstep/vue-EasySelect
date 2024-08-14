<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { inject } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'
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

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 500)

const addToFavorite = async (food) => {
  try {
    if (!food.isFavorite) {
      const obj = {
        parentId: food.id,
        food
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
  <div class="mt-20">
    
    <Carouse />
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

       <div class="absoulute top-0">
        <div class="relative">
          <img class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" src="/search.svg" />
          <input
            @input="onChangeSearchInput"
            class="border border-gray-300 rounded-md py-2 pl-9 pr-4 outline-none text-sm sm:text-base focus:border-gray-400 focus:ring focus:ring-gray-300"
            type="text"
            placeholder="Поиск..."
          />
        </div>
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
  </div>
</template>
