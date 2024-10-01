<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const firstName = ref('')
const lastName = ref('')
const address = ref('')
const phoneNumber = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const router = useRouter() // Получаем доступ к роутеру

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Пароли не совпадают!')
    return
  }

  try {
    const response = await axios.post('http://localhost:8080/signup', {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      phoneNumber: phoneNumber.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    console.log('Регистрация выполнена успешно:', response.data)
    alert('Регистрация успешна! Проверьте свою почту для подтверждения.')
    router.push('/confirmation')
  } catch (error) {
    console.error('Ошибка при регистрации:', error.response?.data || error.message)
    alert('Ошибка при регистрации: ' + (error.response?.data.error || error.message))
  }
}
</script>

<template>
  <div id="registerModal" class="fixed inset-0 flex items-center justify-center bg-gray-100">
    <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

    <div class="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-2xl font-semibold mb-4 text-center">Регистрация</h2>

      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="firstName" class="block text-gray-700">Имя</label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            placeholder="Имя"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label for="lastName" class="block text-gray-700">Фамилия</label>
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            placeholder="Фамилия"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label for="address" class="block text-gray-700">Адрес</label>
          <input
            type="text"
            id="address"
            v-model="address"
            placeholder="Адрес"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label for="phoneNumber" class="block text-gray-700">Номер телефона</label>
          <input
            type="text"
            id="phoneNumber"
            v-model="phoneNumber"
            placeholder="Номер телефона"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-gray-700">Почта</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Почта"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Пароль"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="block text-gray-700">Подтвердите пароль</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Подтвердите пароль"
            class="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
</template>
