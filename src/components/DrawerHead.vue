<script setup>
import { inject } from 'vue'

defineProps({
  totalPrice: Number
})

const { closeDrawer } = inject('cartFoodActions')
</script>

<template>
  <div
    :class="`fixed top-0 right-0 w-96 h-[5em] bg-white p-3 z-50 ${totalPrice && 'border-b border-gray-300'}`"
  >
    <div class="flex bg-b p-3 items-center gap-5 mb-8 z-10">
      <div
        @click="closeDrawer"
        class="cursor-pointer w-10 h-10 flex items-center justify-center transition opacity-60 hover:opacity-100 hover:-translate-x-2"
      >
        <svg
          class="opacity-100 rotate-180 transition mr-4"
          width="20"
          height="19"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 7H14.7143"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.71436 1L14.7144 7L8.71436 13"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold">Корзина</h2>
    </div>
  </div>
</template>
