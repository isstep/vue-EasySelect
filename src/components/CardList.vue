<script setup>
import CardComponent from './CardComponent.vue'

defineProps({
  foods: Array
})

const emit = defineEmits(['addToFavorite'])
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardComponent
      v-for="food in foods"
      :id="food.id"
      :key="food.id"
      :title="food.title"
      :imgUrl="food.imgUrl"
      :price="food.price"
      :onClickAdd="onClickAdd"
      :onCLickFavorite="() => emit('addToFavorite', food)"
      :isFavorite="food.isFavorite"
    />
  </div>
</template>
