<script setup>
defineProps({
  title: String,
  description: String,
  imgUrl: String
})
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <img height="80" width="100" :src="imgUrl" alt="InfoImage" />
    <h2 class="mt-4 text-2xl font-medium">{{ title }}</h2>
    <p class="text-gray-400">{{ description }}</p>
  </div>
</template>
