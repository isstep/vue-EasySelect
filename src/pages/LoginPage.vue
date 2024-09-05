<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const login = () => {
  console.log('Email/Телефон:', email.value)
  console.log('Пароль:', password.value)
  console.log('Запомнить:', rememberMe.value)
}

const register = () => {
  console.log('Переход на страницу регистрации')
}
</script>

<template>
  <div
    id="loginModal"
    class="fixed inset-0 flex items-center justify-center"
    style="background-image: url('/i.webp'); background-size: cover; background-position: center;"
  >
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <div class="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div class="flex justify-end">
        <router-link to="/" class="flex items-center">
          <div class="relative">
            <div class="absolute inset-0 w-8 h-8 -left-3 cursor-pointer"></div>
            <button class="relative text-gray-500 hover:text-gray-700 z-10">&times;</button>
          </div>
        </router-link>
      </div>
      <form @submit.prevent="login">
        <h2 class="text-2xl font-semibold mb-4 text-center">Войти в систему</h2>

        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email/Телефон</label>
          <input
            type="text"
            id="email"
            v-model="email"
            placeholder="Email/Телефон"
            class="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Пароль"
            class="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div class="flex items-center mb-4">
          <input type="checkbox" id="remember" v-model="rememberMe" class="mr-2" />
          <label for="remember" class="text-gray-700">Запомнить пароль</label>
        </div>

        <div class="flex justify-between items-center mb-4">
          <a href="#" class="text-blue-500 hover:underline text-sm">Восстановить</a>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Войти
        </button>
        <button
          type="button"
          @click="register"
          class="w-full mt-4 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
</template>
