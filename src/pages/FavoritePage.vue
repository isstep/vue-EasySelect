<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import CardList from '../components/CardList.vue'

const favorites = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(`https://f4f1d0c1ac4cb845.mokky.dev/favorites?_relations=foods`)

    favorites.value = data.map((obj) => obj.food)
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <h1>Избранные товары</h1>

  <CardList :foods="favorites" />
</template>
