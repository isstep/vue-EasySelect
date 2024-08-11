<script setup>
const emit = defineEmits('removeFoodFromCart')
defineProps({
  id: Number,
  title: String,
  imgUrl: String,
  price: Number
})
</script>

<template>
  <div class="flex items-center border border-slate-200 p-4 rounded-xl gap-4">
    <img class="w-16 h-16" :src="imgUrl" :alt="title" />

    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>
      <div class="flex justify-between mt-2">
        <b class="flex-1">{{ price }} р.</b>
        <img
          @click="() => emit('removeFoodFromCart')"
          class="opacity-100 cursor-pointer transition"
          src="/close.svg"
        />
      </div>
    </div>
  </div>
</template>
