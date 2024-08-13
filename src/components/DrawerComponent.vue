<script setup>
import axios from 'axios'
import { ref, watch, computed, inject } from 'vue'
import DrawerHead from './DrawerHead.vue'
import CardItemList from './CardItemList.vue'
import InfoBlock from './InfoBlock.vue'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const isCreatingOrder = ref(false)

const { cartFood, closeDrawer } = inject('cartFoodActions')

const cartIsEmpty = computed(() => cartFood.value.length === 0)

const buttonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)

const createOrder = async () => {
  try {
    isCreatingOrder.value = true
    const { data } = await axios.post(`https://f4f1d0c1ac4cb845.mokky.dev/orders`, {
      foods: cartFood.value,
      totalPrice: props.totalPrice.value - props.vatPrice.value
    })
    cartFood.value = []
    return data
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrder.value = false
  }
}
</script>

<template>
  <div @click="closeDrawer" class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice" class="flex h-full items-center">
      <InfoBlock
        title="В корзине пусто"
        description="Ищите товары в каталоге и поиске, смотрите интересные подборки на главной"
        imgUrl="/package-icon.png"
      />
    </div>


    <div v-else>
    <CardItemList v-if="totalPrice" />

    <div v-if="totalPrice" class="flex flex-col gap-5 mt-7">
      <div class="flex gap-2">
        <span>Скидка 5%:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ vatPrice }} р.</b>
      </div>

      <div class="flex gap-2">
        <span>Итого:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ totalPrice - vatPrice }} р.</b>
      </div>

      <button
        :disabled="buttonDisabled"
        @click="createOrder"
        class="mt-5 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-400 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
      >
        Оформить заказ
      </button>
      </div>
    </div>
  </div>
</template>
