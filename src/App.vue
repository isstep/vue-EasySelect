<script setup>
import { ref, provide, watch, computed } from 'vue'
import axios from 'axios'
import HeaderMain from './components/HeaderMain.vue'
import DrawerComponent from './components/DrawerComponent.vue'


const cartFood = ref([])

const isCreatingOrder = ref(false)

const drawerOpen = ref(false)

const totalPrice = computed(() => cartFood.value.reduce((acc, food) => acc + food.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))
const cartIsEmpty = computed(() => cartFood.value.length === 0)
const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)

const openDrawer = () => {
  drawerOpen.value = true
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const addFoodToCart = (food) => {
  cartFood.value.push(food)
  food.isAdded = true
}

const removeFoodFromCart = (food) => {
  cartFood.value.splice(cartFood.value.indexOf(food), 1)
  food.isAdded = false
}

const createOrder = async () => {
  try {
    isCreatingOrder.value = true
    const { data } = await axios.post(`https://f4f1d0c1ac4cb845.mokky.dev/orders`, {
      foods: cartFood.value,
      totalPrice: totalPrice.value - vatPrice.value
    })
    cartFood.value = []
    return data
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrder.value = false
  }
}

watch(
  cartFood,
  () => {
    localStorage.setItem('cartFood', JSON.stringify(cartFood.value))
  },
  { deep: true }
)

provide('cartFoodActions', {
  cartFood,
  closeDrawer,
  openDrawer,
  addFoodToCart,
  removeFoodFromCart
})
</script>

<template>
  <DrawerComponent
    v-if="drawerOpen"
    @close-drawer="closeDrawer"
    :total-price="totalPrice"
    :vat-price="vatPrice"
    @create-order="createOrder"
    :button-disabled="cartButtonDisabled"
  />
  <div class="bg-white w-auto m-auto max-w-7xl rounded-t-xl p-1 shadow-xl mt-10">
    <HeaderMain :total-price="totalPrice" @open-drawer="openDrawer" />
    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>
