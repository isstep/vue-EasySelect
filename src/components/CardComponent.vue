<script setup>
defineProps({
  id: Number,
  title: String,
  imgUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function
})
</script>

<template>
  <div
    class="relative bg-white border border-slate-100 rounded-[20px] p-3 top-1 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition max-[615px]:p-10"
  >
    <img
      v-if="onClickFavorite"
      @click="onClickFavorite"
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like 1"
      class="absolute top-3 right-3"
    />
    <img :src="imgUrl" alt="food" class="w-auto h-auto object-cover min-[600px]:w-full h-auto" />
    <div class="flex">
      <b class="text-[#ea0b18]"> {{ price }} р.</b>
    </div>
    <p class="mt-1">{{ title }}</p>
    <div>
      <img
        class="bot-0 left-4"
        v-if="onClickFavorite"
        @click="onClickAdd"
        :src="!isAdded ? '/plus.svg' : '/checked.svg'"
        alt="plus"
      />
    </div>
  </div>
</template>
