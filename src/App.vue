<script setup>
import { ref, provide, watch, computed } from 'vue'
import HeaderMain from './components/HeaderMain.vue'
import DrawerComponent from './components/DrawerComponent.vue'
import FooterComponent from './components/FooterComponent.vue';
const cartFood = ref([])

const drawerOpen = ref(false)

const totalPrice = computed(() => cartFood.value.reduce((acc, food) => acc + food.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

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
  <DrawerComponent v-if="drawerOpen" :total-price="totalPrice" :vat-price="vatPrice" />
  <div class="bg-white w-auto m-auto max-w-7xl p-1">
    <HeaderMain v-if="!$route.meta.hideHeader" :total-price="totalPrice" @open-drawer="openDrawer"  />
    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
  <div class="w-full border-t border-gray-200">
  <FooterComponent />
</div>
</template>
