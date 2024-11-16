
<template>
    <div class="flex flex-col items-center justify-center h-screen">
      <h2 class="text-2xl font-semibold mb-4">Подтверждение регистрации</h2>
      <p class="text-gray-700 text-center">
        Спасибо за регистрацию! Пожалуйста, проверьте вашу почту и подтвердите регистрацию, перейдя по ссылке в письме.
      </p>
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