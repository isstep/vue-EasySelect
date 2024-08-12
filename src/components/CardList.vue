<script setup>
import CardComponent from './CardComponent.vue'

defineProps({
  foods: Array,
  isFavorites: Boolean
})

const emit = defineEmits(['addToFavorite', 'addPlusToCartFood'])
</script>

<template>
  <div class="grid grid-cols-4 gap-5" v-auto-animate>
    <CardComponent
      v-for="food in foods"
      :id="food.id"
      :key="food.id"
      :title="food.title"
      :imgUrl="food.imgUrl"
      :price="food.price"
      :onClickAdd="isFavorites ? null : () => emit('addPlusToCartFood', food)"
      :onCLickFavorite="isFavorites ? null : () => emit('addToFavorite', food)"
      :isFavorite="food.isFavorite"
      :isAdded="food.isAdded"
    />
  </div>
</template>
