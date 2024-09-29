  <script setup>
  import { ref, provide, watch, computed } from 'vue'
  import HeaderMain from './components/HeaderMain.vue'
  import DrawerComponent from './components/DrawerComponent.vue'
  import FooterComponent from './components/FooterComponent.vue'
  import CatalogFood from './components/CatalogFood.vue'

  const cartFood = ref([])
  const drawerOpen = ref(false)
  const catalogOpen = ref(false)

  const totalPrice = computed(() =>
    cartFood.value.reduce((acc, food) => acc + food.price * food.quantity, 0)
  )

  const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

  const openDrawer = () => {
    drawerOpen.value = true
  }

  const closeDrawer = () => {
    drawerOpen.value = false
  }

  const openCatalog = () => {
    catalogOpen.value = true
  }

  const closeCatalog = () => {
    catalogOpen.value = false
  }

  const addFoodToCart = (food) => {
    const cartItem = cartFood.value.find((item) => item.id === food.id)
    if (cartItem) {
      cartItem.quantity += 1
    } else {
      cartFood.value.push({ ...food, quantity: 1 })
      food.isAdded = true
    }
  }

  const removeFoodFromCart = (food) => {
    const cartItem = cartFood.value.find((item) => item.id === food.id)
    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity -= 1
    } else {
      cartFood.value = cartFood.value.filter((item) => item.id !== food.id)
      food.isAdded = false
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
    removeFoodFromCart,
    openCatalog,
    closeCatalog
  })
  </script>

  <template>
    <div>
      <DrawerComponent v-if="drawerOpen" :total-price="totalPrice" :vat-price="vatPrice" />
      <CatalogFood v-if="catalogOpen" />
      <div class="bg-white w-auto m-auto max-w-7xl p-1">
        <HeaderMain
          v-if="!$route.meta.hideHeader"
          :total-price="totalPrice"
          @open-drawer="openDrawer"
          @open-catalog="openCatalog"
          @close-catalog="closeCatalog"
        />
        <div class="p-10">
          
          <router-view></router-view>
        </div>
      </div>
      <div v-if="!$route.meta.hideFooter" class="w-full border-t border-gray-200">
        <FooterComponent v-if="!$route.meta.hideFooter" />
      </div>
    </div>
  </template>
