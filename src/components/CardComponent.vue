<script setup>
import { ref, computed, watch } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['updateQuantity']);

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
});

const randomPercent = ref(Math.floor(Math.random() * 31));  
const discountIds = [18, 5, 8, 1, 3];

const priceDiscount = (price) => {
  return price / (1 - randomPercent.value / 100);
}

const localQuantity = ref(props.quantity || 0);

const syncedQuantity = computed(() => props.quantity);

watch(() => syncedQuantity.value, (newVal) => {
  localQuantity.value = newVal;
}, { immediate: true });

watch(localQuantity, (newVal) => {
  emit('updateQuantity', newVal);
});

const handleIncrement = () => {
  localQuantity.value += 1;
  if (props.onClickIncrement) {
    props.onClickIncrement(props.id, localQuantity.value);
  }
}

const handleDecrement = () => {
  if (localQuantity.value > 1) {
    localQuantity.value -= 1;
    if (props.onClickDecrement) {
      props.onClickDecrement(props.id, localQuantity.value);
    }
  } else {
    if (props.onClickDecrement) {
      props.onClickDecrement(props.id, 0);
    }
    localQuantity.value = 0;
  }
}
</script>

<template>
  <div class="relative bg-white shadow-custom rounded-[16px] p-3 top-1 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition max-[615px]:p-10">
    <img
      v-if="props.onClickFavorite"
      @click="props.onClickFavorite"
      :src="!props.isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like"
      class="absolute top-3 right-3"
    />

    <span
      v-if="discountIds.includes(props.id)"
      class="absolute mt-[15em] w-[36px] h-[18px] flex items-center font-arial justify-center text-[12px] leading-none text-red-100 bg-red-600 rounded"
    >
      -{{ randomPercent }}%
    </span>

    <img :src="props.imgUrl" alt="food" class="w-200 h-200 object-cover min-[600px]:w-200" />

    <div class="flex items-center space-x-2">
      <b class="text-black">{{ props.price }} р.</b>
      <span v-if="discountIds.includes(props.id)" class="text-gray-400 text-sm line-through">
        {{ priceDiscount(props.price).toFixed(2) }} р.
      </span>
    </div>

    <p class="mt-1">{{ props.title }}</p>

    <div v-if="props.isAdded" class="flex items-center mt-2">
      <button @click="handleDecrement" class="bg-red-500 text-white px-2 py-1 rounded">-</button>
      <span class="mx-2">{{ localQuantity }}</span>
      <button @click="handleIncrement" class="bg-green-500 text-white px-2 py-1 rounded">+</button>
    </div>

    <div v-else>
      <img
        class="bot-0 left-4 cursor-pointer"
        @click="handleIncrement"
        :src="!props.isAdded ? '/plus.svg' : '/checked.svg'"
        alt="plus"
      />
    </div>
  </div>
</template>
