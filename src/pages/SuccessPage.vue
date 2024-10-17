<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
    <div class="bg-white p-8 rounded-2xl shadow-xl">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-700">Вход выполнен успешно!</h2>
      <p class="text-center text-gray-600">Вы успешно вошли в систему.</p>
      <router-link 
        to="/" 
        class="mt-6 block text-center text-indigo-500 hover:text-indigo-600 font-medium transition duration-300"
      >
        Перейти на главную страницу
      </router-link>
    </div>
  </div>
</template>