<script setup>
defineProps({
  id: Number,
  title: String,
  imgUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onCLickFavorite: Function,
  onClickAdd: Function
})
</script>

<template>
  <div
    class="relative bg-white border border-slate-100 rounded-[10px] p-9 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition"
  >
    <img
      v-if="onCLickFavorite"
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like 1"
      class="absolute top-7 left-7"
    />
    <img :src="imgUrl" alt="food" class="w-full h-auto object-cover" />
    <div class="flex">
      <b class="text-[#ea0b18]"> {{ price }} р.</b>
    </div>
    <p class="mt-1">{{ title }}</p>
    <div class="flex justify-between mt-1">
      <img v-if="onCLickAdd" @click="onClickAdd" :src="!isAdded ? '/plus.svg' : '/checked.svg'" alt="plus" class="" />
    </div>
  </div>
</template>
