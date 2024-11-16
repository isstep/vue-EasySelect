<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
      <h2 class="text-2xl font-semibold mb-4 text-indigo-600">Подтверждение регистрации</h2>
      <p class="text-gray-700">
        Спасибо за регистрацию! Пожалуйста, проверьте вашу почту и подтвердите регистрацию, 
        перейдя по ссылке в письме.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  document.body.style.overflow = 'hidden'; 
});

onBeforeUnmount(() => {
  document.body.style.overflow = ''; 
});
</script>
