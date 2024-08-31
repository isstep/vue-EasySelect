<script setup>
import axios from 'axios'
import { ref, computed, inject } from 'vue'
import DrawerHead from './DrawerHead.vue'
import CardItemList from './CardItemList.vue'
import InfoBlock from './InfoBlock.vue'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const { cartFood, closeDrawer } = inject('cartFoodActions')

const isCreatingOrder = ref(false)
const orderID = ref(null)

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

    orderID.value = data.id
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrder.value = false
  }
}
</script>

<template>
  <div @click="closeDrawer" class="fixed top-0 left-0 h-full w-full bg-black z-50 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-50 p-8 overflow-y-auto">
    <DrawerHead :totalPrice="totalPrice" />

    <div v-if="!totalPrice || orderID" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderID"
        title="В корзине пусто"
        description="Ищите товары в каталоге и поиске, смотрите интересные подборки на главной"
        imgUrl="/package-icon.png"
      />

      <InfoBlock
        v-if="orderID"
        title="Заказ оформлен"
        :description="`Ваш заказ #${orderID} скоро будет прередан курьерской доставке`"
        imgUrl="/order-success-icon.png"
      />
    </div>

    <div v-else class="mb-[6.3em] mt-[3.3em]">
      <CardItemList v-if="totalPrice" />
      <div class="fixed bottom-0 right-0 w-96 h-[8em] bg-white p-3 z-50 border-t border-gray-300">
        <div class="flex flex-col">
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
            class="mt-3 transition bg-lime-500 w-full rounded-xl py-[0.7em] text-white disabled:bg-slate-400 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bg-white::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.bg-white {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
