<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isError = ref(false)
const isLoading = ref(false) 
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  isError.value = false
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('https://nodejs-server-sfel.onrender.com/login', {
      email: email.value,
      password: password.value
    })

    authStore.login(response.data.token, response.data.user)
    console.log('Вход выполнен успешно:', response.data)
    router.push({ name: 'SuccessPage' })
  } catch (error) {
    isError.value = true
    errorMessage.value = error.response.data.message || 'Ошибка при входе' 
    console.error('Ошибка при входе:', errorMessage.value)
  } finally {
    isLoading.value = false 
  }
}
</script>

<template>
  <div id="loginModal" class="fixed inset-0 flex items-center justify-center bg-gray-100">
    <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

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
        <h2 class="text-2xl font-semibold mb-4 text-center">Авторизация</h2>

        <div class="mb-4">
          <label for="email" class="block text-gray-700">Телефон</label>
          <input
            type="text"
            id="email"
            v-model="email"
            placeholder="Email/Телефон"
            :class="{'border-red-500': isError}" 
            class="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-green-300"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Пароль"
            :class="{'border-red-500': isError}" 
            class="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-green-300"
          />
        </div>

        <div v-if="isError" class="mb-4 text-red-500">{{ errorMessage }}</div>

        <div class="flex items-center mb-4">
          <input type="checkbox" id="remember" v-model="rememberMe" class="mr-2" />
          <label for="remember" class="text-gray-700">Запомнить пароль</label>
        </div>

        <div class="flex justify-between items-center mb-4">
          <a href="#" class="text-green-500 hover:underline text-sm">Восстановить</a>
        </div>

        <button
          type="submit"
          class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          :disabled="isLoading"  
        >
          {{ isLoading ? 'Загрузка...' : 'Войти' }} 
        </button>

        <button
          type="button"
          @click="() => router.push({ name: 'RegisterPage' })"
          class="w-full mt-4 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
</template>
