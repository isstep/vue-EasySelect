<script setup>
import { inject } from 'vue'
import CartItem from './CartItem.vue'

const { cartFood, removeFoodFromCart,  } = inject('cartFoodActions')
</script>

<template>
  <div class="flex flex-col flex-1 gap-1" v-auto-animate>
    <CartItem
      v-for="food in cartFood"
      :key="food.id"
      :title="food.title"
      :price="food.price"
      :quantity="food.quantity"
      :imgUrl="food.imgUrl"
      @remove-food-from-cart="() => removeFoodFromCart(food)"
    />
  </div>
</template>
