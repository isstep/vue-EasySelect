<script setup>
import { inject } from 'vue'

defineProps({
  totalPrice: Number
})

const { closeDrawer, clearCart } = inject('cartFoodActions', {
  closeDrawer: () => {},
  clearCart: null
})

function handleCleanCart() {
  if (clearCart && typeof clearCart === 'function') {
    clearCart()
  } else {
    localStorage.removeItem('cartFood')
  }
}
</script>

<template>
  <div
    :class="`fixed top-0 right-0 w-96 h-[5em] bg-white p-3 z-50 ${totalPrice > 0 ? 'border-b border-gray-300' : ''}`"
  >
    <div class="flex items-center justify-between h-full">
      <div class="flex items-center">
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
        <h2 class="text-2xl font-bold text-gray-800">Корзина</h2>
      </div>

      <button
        v-if="totalPrice > 0"
        @click="handleCleanCart"
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-all duration-200 ease-in-out focus:outline-none"
        title="Очистить корзину"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        <span>Очистить</span>
      </button>
    </div>
  </div>
</template>
