<script setup>


defineProps({
  id: Number,
  title: String,
  imgUrl: String,
  price: Number,
  quantity: Number 
});

const emit = defineEmits(['removeFoodFromCart']);
</script>

<template>
  <div class="flex items-center border border-slate-200 p-4 rounded-xl gap-4">
    <img class="w-16 h-16" :src="imgUrl" :alt="title" />

    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>
      <div class="flex justify-between mt-2">
        <b class="flex-1">{{ price }} р.</b>
        <p class="flex-1 mr-5 text-[10px] mt-1">Количество: {{ quantity }}</p> 
        <img
          @click="() => emit('removeFoodFromCart')"
          class="opacity-100 cursor-pointer transition"
          src="/close.svg"
        />
      </div>
    </div>
  </div>
</template>
