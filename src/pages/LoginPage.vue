<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const visible = ref(true);
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isError = ref(false);
const isLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  isError.value = false;
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await axios.post('https://nodejs-server-sfel.onrender.com/login', {
      email: email.value,
      password: password.value
    });

    const { token, user } = response.data;

    authStore.login(token, user);

    localStorage.setItem('authToken', token);

    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('email', email.value);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('email');
    }

    console.log('Вход выполнен успешно:', response.data);
    router.push('/');

  } catch (error) {
    isError.value = true;
    errorMessage.value = error.response?.data?.message || 'Произошла неизвестная ошибка при входе.';
    console.error('Ошибка при входе:', error);
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  router.push('/');
};

// On component mount
onMounted(() => {
  // Check for "remember me"
  const rememberMeValue = localStorage.getItem('rememberMe');
  if (rememberMeValue === 'true') {
    rememberMe.value = true;
    email.value = localStorage.getItem('email') || '';
  }

  // Check for existing auth token
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    // Assuming your backend provides user info alongside the token,
    // you might need to fetch the user info here using the stored token.
    // For simplicity, I'm setting the user to null in this example.
    authStore.login(storedToken, null);
  }
});
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 flex z-50 items-center justify-center bg-white animate-fadeIn"
    >
      <div class="relative bg-white pt-10 pb-12 px-10 rounded-xl shadow-xl w-full max-w-md m-4 animate-slideIn">

        <button
          type="button"
          @click="close"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none rounded-full p-1.5"
          aria-label="Закрыть"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-emerald-600 mb-3 tracking-tight">EasySelect</h1>

          <hr class="border-gray-200 my-3 mx-auto w-1/2" />
          <h2 class="text-xl font-medium text-slate-700 mt-4">Вход в аккаунт</h2>
        </div>

        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="email-login" class="block text-sm font-medium text-gray-700 mb-1.5">Email или Телефон</label>
            <input
              type="text"
              id="email-login"
              v-model="email"
              placeholder="your@email.com"
              required
              autocomplete="username"
              :class="[
                'w-full px-4 py-2.5 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 placeholder-gray-400',
                isError
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                  : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-opacity-60'
              ]"
            />
          </div>

          <div>
            <label for="password-login" class="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
            <input
              type="password"
              id="password-login"
              v-model="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              :class="[
                'w-full px-4 py-2.5 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 placeholder-gray-400',
                isError
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                  : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-opacity-60'
              ]"
            />
          </div>

          <div v-if="isError && errorMessage" class="text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300 mt-1">
            {{ errorMessage }}
          </div>

          <div class="flex items-center justify-between text-sm pt-1">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="remember-login"
                v-model="rememberMe"
                class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2 accent-emerald-600 cursor-pointer"
              />
              <label for="remember-login" class="text-gray-600 select-none cursor-pointer">Запомнить меня</label>
            </div>
            <router-link to="/forgot-password" class="font-medium text-emerald-600 hover:text-emerald-800 hover:underline focus:outline-none focus:underline">
              Забыли пароль?
            </router-link>
          </div>

          <button
            type="submit"
            class="w-full flex justify-center items-center bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>

          <div class="relative pt-3 pb-2">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-white text-gray-500">Нет аккаунта?</span>
            </div>
          </div>

          <router-link
            :to="{ name: 'RegisterPage' }"
            class="block w-full text-center bg-white text-emerald-700 font-semibold py-2.5 px-4 rounded-lg border border-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-400 transition-colors duration-150 ease-in-out"
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
  from { transform: translateY(-20px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}

input:focus-visible {
  outline: none;
}

button:focus-visible,
a:focus-visible,
input[type="checkbox"]:focus-visible {
  outline-width: 2px;
  outline-style: solid;
  outline-offset: 2px;
}

input:focus-visible:not(.border-red-300) {
  outline-color: theme('colors.emerald.400');
}

input.border-red-300:focus-visible {
  outline-color: theme('colors.red.400');
}

button.absolute:focus-visible {
  outline-color: theme('colors.gray.400');
}

a:focus-visible {
  outline-color: theme('colors.emerald.400');
}

input[type="checkbox"]:focus-visible {
  outline-color: theme('colors.emerald.500');
}

button[type="submit"]:focus-visible {
  outline-color: theme('colors.emerald.500');
}

a.block:focus-visible {
  outline-color: theme('colors.emerald.400');
}
</style>