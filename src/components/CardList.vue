<script setup>
import CardComponent from './CardComponent.vue'

const props = defineProps({
  foods: Array,
  isFavorites: Boolean
})

const emit = defineEmits(['addToFavorite', 'increment', 'decrement', 'remove-from-favorites'])

const handleRemoveFavorite = (foodId) => {
  emit('remove-from-favorites', foodId)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5" v-auto-animate>
    <CardComponent
      v-for="food in props.foods"
      :key="food.id"
      :id="food.id"
      :title="food.title"
      :imgUrl="food.imgUrl"
      :price="food.price"
      :reviewCount="food.reviewCount"
      :averageRating="food.averageRating"
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', food)"
      :onClickIncrement="() => emit('increment', food)"
      :onClickDecrement="() => emit('decrement', food)"
      :isFavorite="food.isFavorite"
      :isAdded="food.isAdded"
      :quantity="food.quantity"
      :isFavoritesPage="isFavorites"
      @remove-from-favorites="handleRemoveFavorite"
    />
  </div>
</template>