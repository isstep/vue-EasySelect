<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'
import { useRouter } from 'vue-router'

const favorites = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://f4f1d0c1ac4cb845.mokky.dev/favorites?_relations=foods`
    )
    favorites.value = data.map((obj) => obj.food)
  } catch (err) {
    console.log(err)
  }
})

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="mt-20">
    <h2 class="text-3xl font-bold mb-8">Избранные товары</h2>

    <div v-if="favorites.length === 0" class="text-center mt-20">
      <p class="text-lg mb-10">Здесь нету избранных товаров, добавьте их!</p>
      <button
        @click="goToHome"
        class="h-10 px-5 text-customGreen transition-colors duration-150 bg-CustomGreen rounded-full focus:shadow-outline hover:customGreen"
      >
        На главную
      </button>
    </div>

    <CardList v-else :foods="favorites" is-favorites />
  </div>
</template>
