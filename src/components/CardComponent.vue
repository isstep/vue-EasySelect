<script setup>
import { computed, ref, onMounted, inject } from 'vue'
import axios from 'axios'

const props = defineProps({
  id: Number,
  imgUrl: String,
  title: String,
  price: Number,
  isFavorite: Boolean,
  onClickFavorite: Function,
  reviewCount: {
    type: Number
  },
  isFavoritesPage: Boolean
})

const emit = defineEmits(['remove-from-favorites'])

const reviews = ref([])
const averageRating = ref(0)

const loadReviews = async (productId) => {
  if (!productId) return
  try {
    const reviewsResponse = await axios.get(
      `https://f4f1d0c1ac4cb845.mokky.dev/reviews?productId=${productId}`
    )
    reviews.value = reviewsResponse.data.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
  } catch (err) {
    console.error('Ошибка загрузки отзывов:', err)
  }
}

onMounted(async () => {
  await loadReviews(props.id)

  if (reviews.value.length > 0) {
    const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0)
    averageRating.value = parseFloat((totalRating / reviews.value.length).toFixed(1))
  } else {
    averageRating.value = 0
  }
})

const renderStars = computed(() => {
  const starCount = 5
  let stars = ''
  for (let i = 1; i <= starCount; i++) {
    const isFilled = i <= averageRating.value
    stars += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${isFilled ? '#ffc107' : '#ddd'}" class="w-4 h-4 inline-block"><path fill-rule="evenodd" d="M10 0l2.928 6.028L20 6.903l-4.854 4.737L16.236 19 10 15.275 3.764 19l1.09-7.36L0 6.903l7.072-.875L10 0z" clip-rule="evenodd"/></svg>`
  }
  return stars
})

const favoriteImageUrl = computed(() => (props.isFavorite ? '/like-2.svg' : '/like-1.svg'))

const handleFavoriteClick = () => {
  if (props.isFavoritesPage) {
    emit('remove-from-favorites', props.id)
  } else if (props.onClickFavorite) {
    props.onClickFavorite()
  }
}

const { cartFood, addFoodToCart, removeFoodFromCart } = inject('cartFoodActions', {
  cartFood: [],
  addFoodToCart: () => console.warn('addFoodToCart not provided'),
  removeFoodFromCart: () => console.warn('removeFoodFromCart not provided')
})

const cartItem = computed(() => {
  if (!cartFood || !Array.isArray(cartFood.value)) {
    console.warn('Injected cartFood is not available or not an array')
    return null
  }
  return cartFood.value.find((item) => item.id === props.id)
})

const isAdded = computed(() => !!cartItem.value)
const quantity = computed(() => cartItem.value?.quantity || 0)

const handleIncrement = () => {
  addFoodToCart({
    id: props.id,
    title: props.title,
    price: props.price,
    imgUrl: props.imgUrl || '/placeholder-food.svg'
  })
}

const handleDecrement = () => {
  if (cartItem.value) {
    removeFoodFromCart(cartItem.value)
  }
}
</script>

<template>
  <div
    class="relative bg-white border border-slate-100 rounded-xl p-4 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl flex flex-col h-full"
  >
    <button
      @click="handleFavoriteClick"
      class="absolute top-4 left-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded z-0"
      :aria-label="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
    >
      <img :src="favoriteImageUrl" alt="Favorite" class="w-6 h-6 relative" />
    </button>

    <router-link :to="`/product/${id}`" class="flex flex-col flex-grow">
      <img
        :src="imgUrl || '/placeholder-food.svg'"
        class="w-full h-40 object-contain mb-3"
        alt="Food item"
        @error="(e) => (e.target.src = '/placeholder-food.svg')"
      />
      <h3 class="font-medium text-gray-800 text-sm mb-1 flex-grow">{{ title }}</h3>
    </router-link>

    <div class="flex items-center mb-2">
      <div class="mr-2" v-html="renderStars"></div>
      <span class="text-sm text-gray-500"> {{ averageRating }} ({{ reviews.length }}) </span>
    </div>

    <div class="flex justify-between items-center mt-auto pt-2">
      <div class="flex flex-col">
        <span class="text-slate-400 text-xs">Цена:</span>
        <b class="text-gray-800 text-sm">{{ price }} ₽</b>
      </div>

      <div class="flex items-center">
        <button
          v-if="isAdded"
          @click="handleDecrement"
          class="p-1 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-full transition border border-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
          :disabled="quantity <= 0"
          aria-label="Уменьшить"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span v-if="isAdded" class="font-medium text-sm mx-2 w-6 text-center" aria-live="polite">{{
          quantity
        }}</span>
        <button
          @click="handleIncrement"
          class="p-1 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-full transition border border-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          :aria-label="isAdded ? 'Увеличить' : 'Добавить в корзину'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
