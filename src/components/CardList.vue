<script setup>
import CardComponent from './CardComponent.vue'

defineProps({
  foods: Array
})

const onClickAdd = () => {
  alert(11)
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <CardComponent
      v-for="food in foods"
      :key="food.id"
      :title="food.title"
      :imgUrl="food.imgUrl"
      :price="food.price"
      :onClickAdd="onClickAdd"
      :isFavorite="food.isFavorite"
    />
  </div>  
</template>
