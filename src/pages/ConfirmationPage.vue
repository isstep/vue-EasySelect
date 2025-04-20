
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h2 class="text-2xl font-semibold mb-4">Подтверждение регистрации</h2>
    <p class="text-gray-700 text-center mb-6">
      Спасибо за регистрацию! Пожалуйста, проверьте вашу почту и подтвердите регистрацию, перейдя по ссылке в письме.
    </p>
    <a href="https://mail.google.com/" target="_blank" class="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Перейти на почту
    </a>
  </div>
</template>