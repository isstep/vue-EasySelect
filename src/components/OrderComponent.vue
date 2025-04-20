<script setup>
import { ref, onMounted, computed } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { useAuthStore } from '../stores/auth'; 

const orders = ref([]) 
const isLoading = ref(true)
const error = ref(null) 

const authStore = useAuthStore();
const emit = defineEmits(['repeat-order'])

const fetchOrders = async () => {
  isLoading.value = true
  error.value = null

  if (!authStore.isAuthenticated || !authStore.user?.id) {
    console.warn("User is not authenticated.  Cannot fetch orders.");
    error.value = "Необходимо войти в систему, чтобы просмотреть заказы.";
    isLoading.value = false;
    return; 
  }

  try {
    const userId = authStore.user.id;
    const url = `https://f4f1d0c1ac4cb845.mokky.dev/orders?userId=${userId}`;

    const response = await fetch(url); 
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Fetched orders:", data); 


    orders.value = data; 
  } catch (err) {
    console.error('Error getting orders:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load orders.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchOrders)

const carouselSettings = {
  itemsToShow: 1.5, 
  snapAlign: 'start',
  wrapAround: false,  
}

const carouselBreakpoints = {

  640: {
    itemsToShow: 2.5,
    snapAlign: 'start',
  },

  768: {
    itemsToShow: 3.5,
    snapAlign: 'start',
  },

  1024: {
    itemsToShow: 4.5,
    snapAlign: 'start',
  },

  1280: {
    itemsToShow: 5, 
    snapAlign: 'start',
  },
}

const handleRepeatOrder = (orderId) => {
  console.log('Repeat order with ID:', orderId)
  emit('repeat-order', orderId)

  alert(`Request to repeat order ${orderId} has been sent! (Implement processing in the parent)`)
}

const formatPrice = (price) => {
  return price?.toFixed(2) ?? '0.00'
}

const hasOrders = computed(() => orders.value.length > 0)

</script>

<template>
  <div class="mt-16 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 mb-8">
      Мои заказы
    </h1>

    <div v-if="isLoading" class="text-center py-10">
      <svg class="animate-spin h-8 w-8 text-emerald-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-600">Загрузка ваших заказов...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Ошибка!</strong>
      <span class="block sm:inline"> {{ error }}</span>
      <button @click="fetchOrders" class="ml-4 text-sm font-medium text-red-800 hover:text-red-600">
        Попробовать снова
      </button>
    </div>

    <div v-else-if="!hasOrders" class="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">У вас пока нет заказов</h3>
      <p class="mt-1 text-sm text-gray-500">Начните делать покупки, чтобы увидеть здесь свои заказы.</p>
      <div class="mt-6">
        <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none ">
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          Перейти к покупкам
        </button>
      </div>
    </div>

    <div v-else class="space-y-10">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200">
          <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
              <p class="text-sm font-medium text-emerald-600">
                Заказ #{{ order.id }}
              </p>
            </div>
            <div class="flex items-center gap-x-4">

              <p class="text-base font-medium text-gray-900">
                Сумма: {{ formatPrice(order.totalPrice) }} р.
              </p>
            </div>
          </div>
        </div>

        <div class="px-4 py-5 sm:p-6">
          <Carousel :settings="carouselSettings" :breakpoints="carouselBreakpoints">
            <Slide v-for="food in order.foods" :key="food.id" class="pr-2 md:pr-3">
               <a :href="`/product/${food.id}`" class="block group">
                  <div class="h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm p-3 flex flex-col hover:border-emerald-500 transition-colors duration-200">
                      <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md mb-3 flex-shrink-0">
                          <img
                            :src="food.imgUrl || '/placeholder-image.png'"
                            :alt="food.title"
                            class="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity"                          />
                      </div>
                      <div class="flex-grow flex flex-col justify-between text-left">
                          <h4 class="text-xs font-medium text-gray-800 leading-tight mb-1 line-clamp-2" :title="food.title">
                              {{ food.title }}
                          </h4>
                          <p class="text-sm font-semibold text-gray-900">
                              {{ formatPrice(food.price) }} р.
                              <span class="text-xs text-gray-500 font-normal"> x {{ food.quantity }} шт.</span>
                          </p>
                      </div>
                  </div>
               </a>
            </Slide>

            <template #addons>
              <Navigation />
            </template>
          </Carousel>
          <div class="mt-6 flex justify-end">
            <button
              @click="handleRepeatOrder(order.id)"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <img
                class="w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 transition-colors"
                src="/repeat.svg"
                alt="Повторить"
                aria-hidden="true"
              />
             
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.carousel__prev,
.carousel__next {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
}
.carousel__prev:hover,
.carousel__next:hover {
  background-color: white;
}

.carousel__prev {
  left: -10px; 
}

.carousel__next {
  right: -10px; 
}

.carousel__icon {
  fill: #000000;
  width: 20px;
  height: 20px;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.aspect-w-1 { --tw-aspect-w: 1; }
.aspect-h-1 { --tw-aspect-h: 1; }


</style>