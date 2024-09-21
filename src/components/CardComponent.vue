<script setup>
import { ref, computed, watch } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['updateQuantity'])

const props = defineProps({
  id: Number,
  title: String,
  imgUrl: String,
  discount: Number,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  quantity: Number,
  onClickFavorite: Function,
  onClickIncrement: Function,
  onClickDecrement: Function
})

const randomPercent = ref(Math.floor(Math.random() * 31))
const discountIds = [18, 6, 8, 13, 3, 24]

const priceDiscount = (price) => {
  return price / (1 - randomPercent.value / 100)
}

const localQuantity = ref(props.quantity || 0)

const syncedQuantity = computed(() => props.quantity)

watch(
  () => syncedQuantity.value,
  (newVal) => {
    localQuantity.value = newVal
  },
  { immediate: true }
)

watch(localQuantity, (newVal) => {
  emit('updateQuantity', newVal)
})

const handleIncrement = () => {
  localQuantity.value += 1
  if (props.onClickIncrement) {
    props.onClickIncrement(props.id, localQuantity.value)
  }
}

const handleDecrement = () => {
  if (localQuantity.value > 1) {
    localQuantity.value -= 1
    if (props.onClickDecrement) {
      props.onClickDecrement(props.id, localQuantity.value)
    }
  } else {
    if (props.onClickDecrement) {
      props.onClickDecrement(props.id, 0)
    }
    localQuantity.value = 0
  }
}
</script>

<template>
  <div
    class="product-card relative bg-white shadow-lg rounded-[0.5em] p-4 cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out border border-slate-100 p-4 rounded-xl gap-4 transform hover:-translate-y-1 max-[615px]:p-6"
  >
    <img
      v-if="props.onClickFavorite"
      @click="props.onClickFavorite"
      :src="!props.isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like"
      class="favorite-icon absolute top-4 right-4 w-6 h-6 cursor-pointer transition-transform duration-200 hover:scale-110"
    />

    <span
      v-if="discountIds.includes(props.id)"
      class="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full"
    >
      -{{ randomPercent }}%
    </span>

    <img :src="props.imgUrl" alt="food" class="w-full h-48 object-cover rounded-md" />

    <div class="flex justify-between items-center mt-4">
      <b
        :class="{
          'text-red-500': discountIds.includes(props.id),
          'text-gray-800': !discountIds.includes(props.id)
        }"
        class="text-lg font-semibold"
      >
        {{ props.price }} р.
      </b>
      <span v-if="discountIds.includes(props.id)" class="text-gray-500 text-sm line-through">
        {{ priceDiscount(props.price).toFixed(2) }} р.
      </span>
    </div>

    <p class="text-sm text-gray-600 mb-12">{{ props.title }}</p>

    <div
      v-if="props.isAdded"
      class="flex items-center rounded-full justify-between mt-4 shadow-sm absolute bottom-4 right-4 w-[12em] shadow-sm border border-slate-50 rounded-full duration-300"
    >
      <button
        @click="handleDecrement"
        class="bg-transparent text-black px-4 py-2 rounded-full flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-sm"
      >
        -
      </button>
      <span class="text-gray-800 font-semibold">{{ localQuantity }}</span>
      <button
        @click="handleIncrement"
        class="bg-transparent text-black px-4 py-2 rounded-full flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-sm"
      >
        +
      </button>
    </div>

    <div v-else class="absolute bottom-4 right-0 w-full flex justify-center">
      <button
        class="add-button w-48 h-10 text-black rounded-[4em] shadow-sm border border-gray border-slate-200 cursor-pointer transition-transform duration-500 flex items-center justify-center"
        @click="handleIncrement"
      >
        <span class="text-sm">В корзину</span>
        <img v-if="!props.isAdded" :src="'/plus.svg'" alt="Add" class="w-0 h-0" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.relative {
  transition: all 0.3s ease;
}
</style>
