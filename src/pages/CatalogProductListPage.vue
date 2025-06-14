<script setup>
import { reactive, ref, watch, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import debounce from 'lodash.debounce'
import CardList from '../components/CardList.vue'

const { cartFood, addFoodToCart, removeFoodFromCart } = inject('cartFoodActions')

const foods = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const route = useRoute()

const categoryId = ref(route.params.categoryId)

const incrementFoodQuantity = (food) => {
  addFoodToCart(food)
}

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 500)

const decrementFoodQuantity = (food) => {
  if (food.isAdded) {
    removeFoodFromCart(food)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

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
    route.push({ name: 'Error404' })
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://f4f1d0c1ac4cb845.mokky.dev/favorites')
    const favoritesMap = favorites.reduce((acc, favorite) => {
      acc[favorite.parentId] = favorite
      return acc
    }, {})

    foods.value = foods.value.map((food) => {
      const favorite = favoritesMap[food.id]

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
    const params = { sortBy: filters.sortBy }
    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }

    const { data } = await axios.get('https://f4f1d0c1ac4cb845.mokky.dev/foods', { params })

    console.log('Полученные данные продуктов:', data)

    foods.value = data
      .filter(
        (food) =>
          Array.isArray(food.categoryIds) && food.categoryIds.includes(Number(categoryId.value))
      )
      .map((obg) => ({
        ...obg,
        isFavorite: false,
        isAdded: false,
        favoriteId: null,
        quantity: 0
      }))

    console.log('Отфильтрованные продукты:', foods.value)
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
    isAdded: cartFood.value.some((cartItemFood) => cartItemFood.id === food.id),
    quantity: cartFood.value.find((cartItemFood) => cartItemFood.id === food.id)?.quantity || 0
  }))
})

watch(cartFood, () => {
  foods.value = foods.value.map((food) => ({
    ...food,
    isAdded: cartFood.value.some((cartItemFood) => cartItemFood.id === food.id),
    quantity: cartFood.value.find((cartItemFood) => cartItemFood.id === food.id)?.quantity || 0
  }))
})

watch(filters, fetchFoods)

watch(
  () => route.params.categoryId,
  async (newCategoryId) => {
    categoryId.value = newCategoryId
    await fetchFoods()
  }
)
</script>

<template>
  <div class="mt-[65px]">
    <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <h2 class="text-xl sm:text-1xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-0">Каталог</h2>

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
            <img
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
              src="/search.svg"
            />
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
        @increment="incrementFoodQuantity"
        @decrement="decrementFoodQuantity"
      />
    </div>
  </div>
</template>
