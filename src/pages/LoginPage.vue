<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const visible = ref(true)
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

    router.push('/')

  } catch (error) {
    isError.value = true
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Произошла неизвестная ошибка при входе.'
    }
    console.error('Ошибка при входе:', error)
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
      v-if="visible"
      class="fixed inset-0 flex z-50 items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      @click.self="close"
    >
      <div class="relative bg-white pt-6 pb-8 px-8 rounded-xl shadow-2xl w-full max-w-md m-4 animate-slideIn">

        <router-link
          to="/"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
          aria-label="Закрыть и перейти на главную"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </router-link>

        <form @submit.prevent="login" class="space-y-5">
          <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">Вход в аккаунт</h2>

          <div>
            <label for="email-login" class="block text-sm font-medium text-gray-700 mb-1">Email или Телефон</label>
            <input
              type="text"
              id="email-login"
              v-model="email"
              placeholder="Ваш email или телефон"
              required
              autocomplete="username"
              :class="[
                  'w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm',
                  isError
                      ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
              ]"
            />
          </div>

          <div>
            <label for="password-login" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              id="password-login"
              v-model="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
               :class="[
                  'w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm',
                  isError
                      ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
              ]"
            />
          </div>

          <div v-if="isError && errorMessage" class="text-sm text-red-700 bg-red-100 p-3 rounded-md border border-red-200">
            {{ errorMessage }}
          </div>

          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="remember-login"
                v-model="rememberMe"
                class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2 accent-emerald-600 cursor-pointer"
              />
              <label for="remember-login" class="text-gray-600 select-none cursor-pointer">Запомнить меня</label>
            </div>
            <a href="#" class="font-medium text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded">
              Забыли пароль?
            </a>
          </div>

          <button
            type="submit"
            class="w-full flex justify-center items-center bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>

           <div class="relative my-5">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Нет аккаунта?</span>
            </div>
          </div>

          <router-link
             :to="{ name: 'RegisterPage' }"
             class="block w-full text-center bg-slate-100 text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 transition-colors duration-150 ease-in-out"
          >
            Создать аккаунт
          </router-link>
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

</style>