<script setup>
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center p-6 font-sans antialiased">
    <h1 class="text-8xl md:text-9xl font-extrabold text-emerald-500 mb-4">
      404
    </h1>
    <p class="text-xl md:text-2xl text-emerald-500 mb-8">
      Страница не найдена.
    </p>
    <router-link
      to="/"
      class="inline-block px-6 py-3 bg-emerald-500 text-white text-lg font-medium rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors duration-200"
    >
      На главную
    </router-link>
  </div>
</template>

<style scoped>
</style>