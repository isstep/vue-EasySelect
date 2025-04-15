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
const isLoading = ref(false)

const router = useRouter()

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Пароли не совпадают!')
    return
  }
  isLoading.value = true
  try {
    const response = await axios.post('https://nodejs-server-sfel.onrender.com/signup', {
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
  } finally {
     isLoading.value = false
  }
}

const close = () => {
   router.push('/');
}

</script>

<template>
  <teleport to="body">
    <div
      id="registerModal"
      class="fixed inset-0 flex z-50 items-center justify-center bg-white/100 backdrop-blur-sm animate-fadeIn"
      @click.self="close"
    >
      <div class="relative bg-white pt-6 pb-8 px-8 rounded-xl shadow-2xl w-full max-w-md m-4 animate-slideIn">

        <router-link
          to="/"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
          aria-label="Закрыть и перейти на главную"
          @click.prevent="close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </router-link>

        <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">
          Регистрация
        </h2>

        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
              type="text"
              id="firstName"
              v-model="firstName"
              placeholder="Ваше имя"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
            <input
              type="text"
              id="lastName"
              v-model="lastName"
              placeholder="Ваша фамилия"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
            <input
              type="text"
              id="address"
              v-model="address"
              placeholder="Город, улица, дом"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>
            <input
              type="tel"
              id="phoneNumber"
              v-model="phoneNumber"
              placeholder="+7 (XXX) XXX-XX-XX"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Электронная почта</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
              autocomplete="username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
              autocomplete="new-password"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
              required
              autocomplete="new-password"
            />
          </div>

          <button
            type="submit"
            class="w-full flex justify-center items-center bg-emerald-600 text-white font-semibold py-3 px-4 mt-6 rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
             <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-25px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.35s ease-out forwards;
}

.backdrop-blur-sm {
    @supports (backdrop-filter: blur(4px)) {
        backdrop-filter: blur(4px);
    }
}

button:focus-visible, a:focus-visible {
    outline: 2px solid theme('colors.emerald.500');
    outline-offset: 2px;
}
.absolute.top-3.right-3:focus-visible {
     outline: 2px solid theme('colors.gray.500');
}

input:focus-visible {
    outline: none; 
}
</style>