<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import DrawerHead from './DrawerHead.vue';
import CardItemList from './CardItemList.vue';
import InfoBlock from './InfoBlock.vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
});

const { cartFood, closeDrawer } = inject('cartFoodActions');
const authStore = useAuthStore();
const router = useRouter(); 

const isCreatingOrder = ref(false);
const orderID = ref(null);
const orderError = ref(null); 

const cartIsEmpty = computed(() => cartFood.value.length === 0);

const buttonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value || !authStore.isAuthenticated);

const totalPriceWithDiscount = computed(() => {
  return (props.totalPrice - props.vatPrice).toFixed(2);
});


onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
  }
});

const createOrder = async () => {
  if (!authStore.isAuthenticated) {
    console.warn('User not authenticated, cannot create order.');
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
    return; 
  }

  try {
    isCreatingOrder.value = true;
    orderError.value = null; 


    if (!authStore.user?.id) {
      console.error("User ID is not available in the auth store.");
      orderError.value = "Could not get user ID. Please try again.";
      return;
    }

    const { data } = await axios.post(`https://f4f1d0c1ac4cb845.mokky.dev/orders`, {
      foods: cartFood.value,
      totalPrice: parseFloat(totalPriceWithDiscount.value), 
      userId: authStore.user.id,
    });
    cartFood.value = [];
    orderID.value = data.id;
    console.log("Order created successfully:", data);
  } catch (err) {
    console.error("Error creating order:", err);
    orderError.value = "An error occurred while creating the order. Please try again.";
    if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        orderError.value += ` (Status: ${err.response.status})`;  
      }
  } finally {
    isCreatingOrder.value = false;
  }
};
</script>

<template>
  <div @click="closeDrawer" class="fixed top-0 left-0 h-full w-full bg-black z-50 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-50 p-8 overflow-y-auto">
    <DrawerHead :totalPrice="props.totalPrice" />

    <div v-if="!props.totalPrice || orderID || orderError" class="flex h-full items-center">
      <InfoBlock
        v-if="!props.totalPrice && !orderID && !orderError"
        title="В корзине пусто"
        description="Ищите товары в каталоге и поиске, смотрите интересные подборки на главной"
        imgUrl="/package-icon.png"
      />

      <InfoBlock
        v-if="orderID"
        title="Заказ оформлен"
        :description="`Ваш заказ #${orderID} скоро будет передан курьерской доставке`"
        imgUrl="/order-success-icon.png"
      />

      <InfoBlock
        v-if="orderError"
        title="Ошибка при оформлении заказа"
        :description="orderError"
        imgUrl="/error-icon.png"
        />
    </div>

    <div v-else class="mb-[6.3em] mt-[3.3em]">
      <CardItemList v-if="props.totalPrice" />
      <div class="fixed bottom-0 right-0 w-96 h-[8em] bg-white p-3 z-50 border-t border-gray-300">
        <div class="flex flex-col">
          <div class="flex gap-2">
            <span>Скидка 5%:</span>
            <div class="flex-1 border-b border-dashed"></div>
            <b>{{ props.vatPrice.toFixed(2) }} р.</b>
          </div>

          <div class="flex gap-2">
            <span>Итого:</span>
            <div class="flex-1 border-b border-dashed"></div>
            <b>{{ totalPriceWithDiscount }} р.</b>
          </div>

          <button
            :disabled="buttonDisabled"
            @click="createOrder"
            class="mt-3 transition bg-customGreen w-full rounded-xl py-[0.7em] text-white disabled:bg-slate-400 hover:bg-green-800 active:bg-customGray cursor-pointer"
          >
            Оформить заказ
          </button>

          <!-- Conditional rendering for login button (now redundant) -->
         <!--
          <router-link v-if="!authStore.isAuthenticated" to="/login">
            <button class="mt-3 transition bg-blue-500 w-full rounded-xl py-[0.7em] text-white hover:bg-blue-700">
              Войти для оформления заказа
            </button>
          </router-link>
        -->
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