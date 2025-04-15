<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'
import { useRouter } from 'vue-router'

const favorites = ref([])
const router = useRouter()

const loadFavorites = async () => {
  try {
    const { data } = await axios.get(
      `https://f4f1d0c1ac4cb845.mokky.dev/favorites?_relations=foods`
    )
    favorites.value = data.map((obj) => obj.food)
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await loadFavorites()
})

const goToHome = () => {
  router.push('/')
}

const removeFromFavorites = async (foodId) => {
  try {
    await axios.delete(`https://f4f1d0c1ac4cb845.mokky.dev/favorites/${foodId}`)

    favorites.value = favorites.value.filter((food) => food.id !== foodId)



  } catch (error) {
    console.error('Ошибка при удалении из избранного:', error)
  }
}
</script>

<template>
  <div class="mt-20">
    <h2 class="text-3xl font-bold mb-8">Избранные товары</h2>

    <div v-if="favorites.length === 0" class="text-center mt-20">
      <p class="text-lg mb-10">Здесь нету избранных товаров, добавьте их!</p>
      <button
        @click="goToHome"
        class="h-10 px-5 text-white transition-colors duration-150 bg-customGreen rounded-full focus:shadow-outline hover:customGreen"
      >
        На главную
      </button>
    </div>

    <CardList v-else :foods="favorites" is-favorites @remove-from-favorites="removeFromFavorites" />
  </div>
</template>