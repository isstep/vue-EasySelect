<script setup>
import CardComponent from './CardComponent.vue'

defineProps({
  foods: Array,
  isFavorites: Boolean
})

const emit = defineEmits(['addToFavorite', 'addPlusToCartFood'])
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3" v-auto-animate>
    <CardComponent
      v-for="food in foods"
      :id="food.id"
      :key="food.id"
      :title="food.title"
      :imgUrl="food.imgUrl"
      :price="food.price"
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', food)"
      :onClickAdd="isFavorites ? null : () => emit('addPlusToCartFood', food)"
      :isFavorite="food.isFavorite"
      :isAdded="food.isAdded"
    />
  </div>
</template>
