<script setup>
import { onMounted, reactive, provide, ref, watch, computed } from 'vue'
import axios from 'axios'
import HeaderMain from './components/HeaderMain.vue'
import CardList from './components/CardList.vue'
import DrawerComponent from './components/DrawerComponent.vue'
import Carouse from './components/Carouse.vue'

const foods = ref([])
const cartFood = ref([])

const drawerOpen = ref(false)

const closeDrawer = () => {
  drawerOpen.value = false
}

const totalPrice = computed(() => cartFood.value.reduce((acc, food) => acc + food.price, 0))

const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const openDrawer = () => {
  drawerOpen.value = true
}

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const cartFoodSet = new Set()

const addToCartFood = (food) => {
  if (cartFoodSet.has(food)) {
    removeFoodFromCart(food)
  } else {
    addFoodToCart(food)
  }
}

const addFoodToCart = (food) => {
  cartFoodSet.add(food)
  cartFood.value.push(food)
  food.isAdded = true
}

const removeFoodFromCart = (food) => {
  cartFoodSet.delete(food)
  cartFood.value = cartFood.value.filter((item) => item !== food)
  food.isAdded = false
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

const createOrder = async () => {
  try {
    const { data } = await axios.post(`https://f4f1d0c1ac4cb845.mokky.dev/orders`, {
      foods: cartFood.value,
      totalPrice: totalPrice.value
    })
    cartFood.value = []
    return data
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await fetchFoods()
  await fetchFavorites()
})

watch(filters, fetchFoods)

provide('cartFoodActions', { cartFood, closeDrawer, openDrawer, addToCartFood, removeFoodFromCart })
</script>

<template>
  <DrawerComponent
    v-if="drawerOpen"
    @close-drawer="closeDrawer"
    :total-price="totalPrice"
    :vat-price="vatPrice"
    @create-order="createOrder"
  />
  <div class="bg-white w-auto m-auto max-w-7xl rounded-t-xl p-1 shadow-xl mt-10">
    <div class="stars"></div>
    <div class="stars2"></div>
    <HeaderMain :total-price="totalPrice" @open-drawer="openDrawer" />
    <Carouse />
    <div class="p-10">
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
          @add-to-cart-food="addToCartFood"
        />
      </div>
    </div>
  </div>
  iv>
</template>
