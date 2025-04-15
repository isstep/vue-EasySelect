<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const { cartFood, addFoodToCart, removeFoodFromCart } = inject('cartFoodActions')
//const { favorites, addToFavorites, removeFromFavorites } = inject('favoritesActions'); 

const route = useRoute()

const product = ref(null)
const reviews = ref([])
const newReviewText = ref('')
const newReviewRating = ref(0)
const newReviewUserName = ref('')
const isLoading = ref(true)
const error = ref(null)
const isFavorite = ref(false)


const categories = ref([
  { id: 13077, name: 'Овощи и фрукты' },
  { id: 2, name: 'Молочные продукты' },
  { id: 7544, name: 'Мясо и рыба' },

])

const productInCart = computed(() => {
  if (!product.value) return null
  return cartFood.value.find((item) => item.id === product.value.id)
})
const isInCart = computed(() => !!productInCart.value)
const quantityInCart = computed(() => productInCart.value?.quantity || 0)


const productCategories = computed(() => {
  if (!product.value || !product.value.categoryIds || !Array.isArray(product.value.categoryIds)) {
    return [] 
  }

  return categories.value.filter(cat => product.value.categoryIds.includes(cat.id))
})

const toggleFavorite = () => {
  if (!product.value) return;
  isFavorite.value = !isFavorite.value;
  if (isFavorite.value) {
    console.log(`Добавлено в избранное: ${product.value.title} (ID: ${product.value.id})`);
  } else {
    console.log(`Удалено из избранного: ${product.value.title} (ID: ${product.value.id})`);
  }
};

const loadProduct = async (id) => {
  isLoading.value = true
  error.value = null
  reviews.value = []
  product.value = null
  isFavorite.value = false
  try {
    const productResponse = await axios.get(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${id}`)
    if (!productResponse.data || !productResponse.data.id) {
      throw new Error('Товар не найден или получен некорректный ответ от сервера.')
    }
    product.value = productResponse.data
    product.value.imageUrl = product.value.imgUrl || product.value.imageUrl || '/placeholder-food.svg';
    product.value.description = product.value.description || '';
    product.value.storageConditions = product.value.storageConditions || '';
    if (!Array.isArray(product.value.categoryIds)) {
        product.value.categoryIds = [];
    }


    await loadReviews(id)
  } catch (err) {
    console.error('Ошибка загрузки продукта:', err)
    error.value = `Не удалось загрузить информацию о товаре. ${err.message || ''}`
    product.value = null
  } finally {
    isLoading.value = false
  }
}

const loadReviews = async (productId) => {
  // ... (без изменений)
   if (!productId) return
  try {
    const reviewsResponse = await axios.get(
      `https://f4f1d0c1ac4cb845.mokky.dev/reviews?productId=${productId}`
    )
    reviews.value = reviewsResponse.data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (err) {
    console.error('Ошибка загрузки отзывов:', err)
  }
}

const submitReview = async () => {
  // ... (без изменений)
   if (!newReviewUserName.value.trim()) return alert('Пожалуйста, введите ваше имя.')
  if (newReviewRating.value === 0) return alert('Пожалуйста, поставьте оценку.')
  if (!newReviewText.value.trim()) return alert('Пожалуйста, напишите текст отзыва.')
  if (!product.value || !product.value.id) return alert('Ошибка: ID товара не определен.')
  if (newReviewUserName.value.length > 50) return alert('Имя не должно превышать 50 символов.');
  if (newReviewText.value.length > 500) return alert('Текст отзыва не должен превышать 500 символов.');


  try {
    const reviewData = {
      productId: Number(product.value.id),
      text: newReviewText.value.trim(),
      rating: newReviewRating.value,
      userName: newReviewUserName.value.trim(),
      createdAt: new Date().toISOString()
    }
    const response = await axios.post('https://f4f1d0c1ac4cb845.mokky.dev/reviews', reviewData)
    reviews.value.unshift(response.data)
    newReviewText.value = ''
    newReviewRating.value = 0
    newReviewUserName.value = ''
  } catch (err) {
    console.error('Ошибка отправки отзыва:', err)
    alert(`Не удалось отправить отзыв. ${err.response?.data?.message || 'Попробуйте позже.'}`)
  }
}

const handleIncrement = () => {
  // ... (без изменений)
   if (product.value) {
    const productToAdd = {
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      imageUrl: product.value.imageUrl // Уже содержит imgUrl или плейсхолдер
    }
    addFoodToCart(productToAdd)
  }
}

const handleDecrement = () => {
  if (productInCart.value) {
    removeFoodFromCart(productInCart.value)
  }
}

onMounted(() => {
  const currentId = route.params.id
  if (currentId && !isNaN(Number(currentId))) {
    loadProduct(Number(currentId))
  } else {
    error.value = 'Некорректный ID товара в адресе.'
    isLoading.value = false
  }
})

watch(
  () => route.params.id,
  (newId, oldId) => {
     if (newId && newId !== oldId && !isNaN(Number(newId))) {
      loadProduct(Number(newId))
    } else if (newId && isNaN(Number(newId))) {
        error.value = 'Некорректный ID товара в адресе.';
        isLoading.value = false;
        product.value = null;
        reviews.value = [];
    }
  }
)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <div v-if="isLoading && !product && !error" class="text-center py-24">
      </div>

      <div v-else-if="error" class="text-center py-16 bg-red-100 border-l-4 border-red-500 text-red-700 px-6 rounded-md shadow">
      </div>

      <div
        v-else-if="product"
        class="bg-white rounded-xl shadow-lg overflow-hidden"
        :class="{ 'opacity-75 transition-opacity duration-300': isLoading }"
      >


        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">

          <div class="flex justify-center items-center bg-gray-100 p-6 md:p-10 lg:p-12 min-h-[300px] md:min-h-[400px] max-h-[550px] md:rounded-l-xl">
            <img :src="product.imageUrl" :alt="product.title || 'Изображение товара'" class="max-w-full max-h-full h-auto object-contain transition-opacity duration-500 ease-in-out" :class="{ 'opacity-0': !product.imageUrl }" @load="(e) => e.target.classList.add('opacity-100')" @error="(e) => { e.target.src = '/placeholder-food.svg'; e.target.classList.add('opacity-100', 'w-32', 'h-32', 'img-error'); }" />
          </div>

          <div class="flex flex-col p-6 md:p-8 lg:p-10 space-y-5">

            <div v-if="productCategories.length > 0" class="mb-2 text-sm">
              <span class="text-gray-500">Категории: </span>
              <template v-for="(category, index) in productCategories" :key="category.id">
                <router-link
                  :to="`/catalog/${category.id}`"
                  class="text-emerald-700 hover:text-emerald-900 hover:underline font-medium"
                >
                  {{ category.name }}
                </router-link>
                <span v-if="index < productCategories.length - 1" class="text-gray-500">, </span>
              </template>
            </div>

            <h1 class="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">{{ product.title }}</h1>

            <p v-if="product.description" class="text-gray-600 leading-relaxed text-base lg:text-lg">
              {{ product.description }}
            </p>

            <div v-if="product.storageConditions" class="pt-2">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Условия хранения:</h3>
                <p class="text-gray-600 text-sm leading-relaxed">{{ product.storageConditions }}</p>
            </div>

            <hr class="border-gray-200 my-3">

            <div class="flex items-baseline space-x-3">
              <span class="text-4xl font-extrabold text-emerald-600">{{ product.price }} ₽</span>
              <span v-if="product.oldPrice && product.oldPrice > product.price" class="text-lg text-gray-400 line-through">{{ product.oldPrice }} ₽</span>
            </div>
            <p v-if="product.discount" class="text-sm font-medium text-red-600 bg-red-100 px-2.5 py-1 rounded-full inline-block self-start">
              Скидка: {{ product.discount }}%
            </p>

            <div class="pt-4 flex items-center gap-4 flex-wrap">
              <div v-if="!isInCart" class="flex-grow sm:flex-grow-0">
                <button @click="handleIncrement" :disabled="isLoading" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out flex items-center justify-center space-x-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span>В корзину</span>
                </button>
              </div>
              <div v-else class="flex items-center border border-emerald-300 rounded-lg overflow-hidden shadow-sm flex-grow sm:flex-grow-0">
                  <button @click="handleDecrement" :disabled="isLoading" class="px-4 py-3 text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100 transition duration-150 disabled:opacity-50" aria-label="Уменьшить количество"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" /></svg></button>
                  <span class="px-5 py-3 text-lg font-semibold text-emerald-800 bg-emerald-50 min-w-[60px] text-center">{{ quantityInCart }}</span>
                  <button @click="handleIncrement" :disabled="isLoading" class="px-4 py-3 text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100 transition duration-150 disabled:opacity-50" aria-label="Увеличить количество"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg></button>
              </div>

              <button @click="toggleFavorite" :disabled="isLoading" class="p-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50" :class="isFavorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:border-gray-300'" :aria-label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'" title="Добавить в избранное">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path :d="isFavorite ? 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' : 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z'" /></svg>
              </button>

            </div> 
          </div> 
        </div> 
      </div> 
        <div
        v-if="product && !error"
        class="mt-12 pt-8"
        :class="{ 'opacity-75 transition-opacity duration-300': isLoading }"
      >
        <h2 class="text-3xl font-bold text-emerald-800 mb-8 text-center md:text-left">
          Отзывы покупателей ({{ reviews.length }})
        </h2>

        <div class="mb-10 p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 class="text-2xl font-semibold text-emerald-700 mb-5">Оставить свой отзыв</h3>
          <form @submit.prevent="submitReview" class="space-y-5">
             <div>
              <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">Ваше имя:</label>
              <input
                id="userName"
                v-model="newReviewUserName"
                type="text"
                placeholder="Как вас зовут?"
                required
                maxlength="50"
                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ваша оценка:</label>
              <div class="flex items-center space-x-1 star-rating">
                <button
                  type="button"
                  v-for="star in 5"
                  :key="star"
                  @click="newReviewRating = star"
                  class="text-4xl transition-colors duration-150 focus:outline-none"
                  :class="
                    newReviewRating >= star
                      ? 'text-yellow-400 filter drop-shadow'
                      : 'text-gray-300 hover:text-yellow-300'
                  "
                  :aria-label="`Поставить ${star} звезд`"
                >
                  ★
                </button>
                <span v-if="newReviewRating > 0" class="ml-4 text-gray-600 font-medium">({{ newReviewRating }} из 5)</span>
              </div>
            </div>
            <div>
              <label for="reviewText" class="block text-sm font-medium text-gray-700 mb-1">Ваш отзыв:</label>
              <textarea
                id="reviewText"
                v-model="newReviewText"
                placeholder="Поделитесь вашими впечатлениями о товаре..."
                required
                rows="4"
                maxlength="500"
                class="w-full p-3 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              ></textarea>
                <p class="text-xs text-gray-500 mt-1 text-right">{{ newReviewText.length }} / 500</p>
            </div>
            <button
              type="submit"
              class="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200"
            >
              Отправить отзыв
            </button>
          </form>
        </div>
        <div v-if="reviews.length > 0" class="space-y-6">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="p-5 bg-white rounded-lg shadow border border-gray-100 transition duration-300 hover:shadow-md"
          >
             <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
              <p class="font-semibold text-lg text-emerald-800 break-words">{{ review.userName || 'Аноним' }}</p>
              <div class="flex items-center text-xl text-yellow-400 flex-shrink-0">
                <span>{{ '★'.repeat(review.rating) }}</span
                ><span class="text-gray-300">{{ '★'.repeat(5 - review.rating) }}</span>
              </div>
            </div>
             <p class="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{{ review.text }}</p>
             <p v-if="review.createdAt" class="text-xs text-gray-400 mt-3 text-right">
                {{ new Date(review.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
        </div>
        <p v-else class="text-center text-gray-500 italic py-8">Для этого товара пока нет отзывов. Будьте первым!</p>
      </div>
    </div>
    </div> 

</template>

<style scoped>
.star-rating button.text-yellow-400 {
  text-shadow: 0 0 5px rgba(250, 204, 21, 0.5);
}
img.img-error {
    object-fit: contain;
    width: 8rem;
    height: 8rem;
    opacity: 0.6;
}
*:focus-visible {
  outline: 2px solid theme('colors.emerald.400');
  outline-offset: 2px;
  border-radius: 4px;
}
*:focus {
    outline: none;
}
.whitespace-pre-wrap {
    white-space: pre-wrap;
    word-wrap: break-word;
}
.break-words {
    word-break: break-word;
    overflow-wrap: break-word;
}
</style>