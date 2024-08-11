<script setup>
import { inject } from 'vue'
import CardItem from './CardItem.vue'

const { cartFood, removeFoodFromCart } = inject('cartFoodActions')
</script>

<template>
  <div class="flex flex-col flex-1 gap-1">
    <CardItem
      v-for="food in cartFood"
      :key="food.id"
      :title="food.title"
      :price="food.price"
      :imgUrl="food.imgUrl"
      @remove-food-from-cart="() => removeFoodFromCart(food)"
    />
  </div>
</template>
