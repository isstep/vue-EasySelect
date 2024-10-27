<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)
const reviews = ref([])
const newReview = ref('')
const rating = ref(0) 
const userName = ref('') 

const loadProduct = async (id) => {
  try {
    const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${id}`)
    product.value = await response.json()
    await loadReviews(id)
  } catch (error) {
    console.error('Error loading product:', error)
  }
}

const loadReviews = async (productId) => {
  try {
    const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/reviews?productId=${productId}`)
    reviews.value = await response.json()
  } catch (error) {
    console.error('Error loading reviews:', error)
  }
}

const submitReview = async () => {
  if (newReview.value.trim() === '' || rating.value === 0 || userName.value.trim() === '') return 

  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: route.params.id,
        text: newReview.value,
        rating: rating.value,
        userName: userName.value // Отправляем имя пользователя
      })
    })

    if (response.ok) {
      newReview.value = ''
      rating.value = 0 // Сброс рейтинга
      userName.value = '' // Сброс имени пользователя
      await loadReviews(route.params.id)
    } else {
      console.error('Failed to submit review')
    }
  } catch (error) {
    console.error('Error submitting review:', error)
  }
}

onMounted(() => {
  loadProduct(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    loadProduct(newId)
  }
)
</script>

<template>
  <div class="container mx-auto">
    <div v-if="product" class="bg-white rounded-lg">
      <h1 class="text-3xl font-bold">{{ product.title }}</h1>
      <img :src="product.imgUrl" alt="product image" class="mt-4 rounded-lg max-w-full h-auto" />
      <p class="mt-4 text-lg text-gray-700">{{ product.description }}</p>
      <p class="mt-4 text-xl">
        Цена: <span class="font-semibold">{{ product.price }}</span> руб.
      </p>
      <p v-if="product.discount" class="mt-2 text-lg text-red-600">
        Скидка: <span>{{ product.discount }}%</span>
      </p>

      <h2 class="mt-6 text-2xl text-green-700 font-semibold">Отзывы</h2>
      <div v-if="reviews.length">
        <ul class="mt-2 space-y-2">
          <li
            v-for="review in reviews"
            :key="review.id"
            class=" border border-green-200 rounded-lg p-4"
          >
            <p class="font-semibold">Имя: <span class="text-gray-700">{{ review.userName }}</span></p> 
            <p class="font-semibold">Рейтинг: 
              <span class="text-yellow-500">{{ '★'.repeat(review.rating) }}</span>
              <span class="text-gray-300">{{ '★'.repeat(5 - review.rating) }}</span>
            </p> 
            <p>{{ review.text }}</p>
          </li>
        </ul>
      </div>
      <p v-else class="mt-2 text-gray-500">Отзывов пока нет.</p>

      <h3 class="mt-6 text-xl text-green-700 font-semibold">Оставить отзыв</h3>
      <input
        v-model="userName"
        placeholder="Ваше имя"
        class="mt-2 w-full p-2 border border-gray-300 rounded-lg"
      />
      <div class="flex items-center mt-2">
        <span v-for="star in [1, 2, 3, 4, 5]" :key="star" @click="rating = star" class="cursor-pointer"
              :class="{'text-yellow-500': rating >= star, 'text-gray-300': rating < star}"
              @mouseover="rating = star"
              @mouseleave="rating = rating"> 
          ★
        </span>
        <span class="ml-2 text-gray-700">{{ rating }} звёзд</span> 
      </div>
      <textarea
        v-model="newReview"
        placeholder="Напишите ваш отзыв..."
        class="mt-2 w-full h-24 p-2 border border-gray-300 rounded-lg resize-none"
      ></textarea>
      <button
        @click="submitReview"
        class="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition"
      >
        Отправить отзыв
      </button>
    </div>
    <div v-else>
      <p class="text-red-600 font-bold">Продукт не найден или произошла ошибка загрузки.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding-top: 5em; 
}

.star {
  font-size: 2rem; 
  transition: color 0.3s ease;
}

.star:hover {
  transform: scale(1.2); 
}
</style>
