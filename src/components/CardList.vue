<script setup>
import CardComponent from './CardComponent.vue'

const props = defineProps({
  foods: Array,
  isFavorites: Boolean
})

const emit = defineEmits(['addToFavorite', 'increment', 'decrement'])
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3" v-auto-animate>
    <CardComponent
      v-for="food in props.foods"
      :key="food.id"
      :id="food.id"
      :title="food.title"
      :imgUrl="food.imgUrl"
      :price="food.price"
      :onClickFavorite="props.isFavorites ? null : () => emit('addToFavorite', food)"
      :onClickIncrement="() => emit('increment', food)"
      :onClickDecrement="() => emit('decrement', food)"
      :isFavorite="food.isFavorite"
      :isAdded="food.isAdded"
      :quantity="food.quantity"
    />
  </div>
</template>
