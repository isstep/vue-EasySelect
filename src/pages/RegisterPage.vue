<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const country = 'Беларусь'
const city = 'Минск'
const phoneCode = '+375'
const targetPhoneLength = 9 

const street = ref('')
const houseNumber = ref('')
const apartmentNumber = ref('')
const phoneRest = ref('')

const router = useRouter()

const passwordMismatchError = ref(false)
const streetError = ref(false)
const houseNumberError = ref(false)
const phoneRestError = ref(false)
const genericApiError = ref('') 

const fullAddress = computed(() => {
  let addr = `${country}, г. ${city}, ул. ${street.value}, д. ${houseNumber.value}`
  if (apartmentNumber.value) {
    addr += `, кв. ${apartmentNumber.value}`
  }
  return addr.replace(/,\s*$/, '').trim()
})

const cleanedPhoneRest = computed(() => phoneRest.value.replace(/\D/g, ''))

const fullPhoneNumber = computed(() => {
  if (cleanedPhoneRest.value) {
    return `${phoneCode}${cleanedPhoneRest.value}`
  }
  return ''
})

const phoneCharsInfo = computed(() => {
  const currentLength = cleanedPhoneRest.value.length;
  if (currentLength >= targetPhoneLength) {
    return { text: '✓', remaining: 0, isComplete: true };
  }
  const remaining = targetPhoneLength - currentLength;
  let suffix = 'символов';
  if (remaining === 1) suffix = 'символ';
  else if (remaining >= 2 && remaining <= 4) suffix = 'символа';
  return { text: `Осталось ввести ${remaining} ${suffix}`, remaining: remaining, isComplete: false };
});


const validateInputs = () => {
  passwordMismatchError.value = false
  streetError.value = false
  houseNumberError.value = false
  phoneRestError.value = false
  genericApiError.value = '' 
  let hasErrors = false

  if (password.value !== confirmPassword.value) {
    passwordMismatchError.value = true
    hasErrors = true
  }

  if (!street.value) {
    streetError.value = true
    hasErrors = true
  }

  if (!houseNumber.value) {
    houseNumberError.value = true
    hasErrors = true
  }

  if (!phoneRest.value) { 
     phoneRestError.value = true
     hasErrors = true
  } else if (cleanedPhoneRest.value.length !== targetPhoneLength) { 
      phoneRestError.value = true
      hasErrors = true
  }
  return !hasErrors 
}

const register = async () => {
  if (!validateInputs()) {
    return 
  }

  isLoading.value = true
  genericApiError.value = '' 

  try {
    const response = await axios.post('https://nodejs-server-sfel.onrender.com/signup', {
      firstName: firstName.value,
      lastName: lastName.value,
      address: fullAddress.value,
      phoneNumber: fullPhoneNumber.value, 
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    console.log('Регистрация выполнена успешно:', response.data)
    router.push('/confirmation')
  } catch (error) {
    console.error('Ошибка при регистрации:', error.response?.data || error.message)
    genericApiError.value = error.response?.data?.message || error.response?.data?.error || 'Неизвестная ошибка при регистрации. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}

const close = () => {
  router.push('/')
}
</script>

<template>
  <teleport to="body">
    <div
      id="registerModal"
      class="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto py-10 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      aria-labelledby="registerModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative bg-white pt-6 pb-8 px-6 sm:px-8 rounded-xl shadow-2xl w-full max-w-lg m-auto animate-slideIn max-h-[95vh] overflow-y-auto"
      >

        <button
          type="button"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1 z-10"
          aria-label="Закрыть"
          @click="close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="registerModalTitle" class="text-2xl font-semibold text-slate-800 mb-6 text-center pr-8">
          Регистрация
        </h2>

        <form @submit.prevent="register" class="space-y-4 sm:space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                placeholder="Ваше имя"
                class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
                autocomplete="given-name"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Фамилия *</label>
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                placeholder="Ваша фамилия"
                class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
                autocomplete="family-name"
              />
            </div>
          </div>

          <fieldset class="border border-gray-300 p-4 rounded-lg space-y-4">
            <legend class="text-sm font-medium text-gray-700 px-1">Адрес ({{ country }}, {{ city }})</legend>
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700 mb-1">Улица *</label>
              <input
                type="text"
                id="street"
                v-model="street"
                placeholder="Например, Независимости"
                class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400"
                :class="[
                  streetError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                ]"
                required
                autocomplete="address-line1"
                aria-invalid="streetError"
                aria-describedby="street-error"
              />
              <p v-if="streetError" id="street-error" class="mt-1 text-xs text-red-600">Поле Улица обязательно.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="houseNumber" class="block text-sm font-medium text-gray-700 mb-1">Дом *</label>
                <input
                  type="text"
                  id="houseNumber"
                  v-model="houseNumber"
                  placeholder="10"
                  class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400"
                  :class="[
                    houseNumberError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                  ]"
                  required
                  autocomplete="address-line2"
                  aria-invalid="houseNumberError"
                  aria-describedby="house-error"
                />
                 <p v-if="houseNumberError" id="house-error" class="mt-1 text-xs text-red-600">Поле Дом обязательно.</p>
              </div>
              <div>
                <label for="apartmentNumber" class="block text-sm font-medium text-gray-700 mb-1">Квартира</label>
                <input
                  type="text"
                  id="apartmentNumber"
                  v-model="apartmentNumber"
                  placeholder="5"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm placeholder-gray-400"
                  autocomplete="address-line3"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500">* Обязательные поля</p>
          </fieldset>

          <div>
            <label for="phoneRest" class="block text-sm font-medium text-gray-700 mb-1">Номер телефона *</label>
            <div class="flex items-center space-x-2">
              <span class="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 whitespace-nowrap">{{ phoneCode }}</span>
              <input
                type="tel"
                id="phoneRest"
                v-model="phoneRest"
                placeholder="(XX) XXX-XX-XX"
                inputmode="numeric"  
                maxlength="9" 
                class="flex-grow min-w-0 px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400"
                :class="[
                  phoneRestError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                ]"
                required
                autocomplete="tel-national"
                aria-invalid="phoneRestError"
                aria-describedby="phone-error phone-hint"
              />
            </div>
     
            <p v-if="phoneRestError" id="phone-error" class="mt-1 text-xs text-red-600">
              Требуется ввести ровно {{ targetPhoneLength }} цифр номера телефона.
            </p>
     
             <p v-if="!phoneRestError" id="phone-hint" class="text-xs mt-1" :class="phoneCharsInfo.isComplete ? 'text-green-600' : 'text-gray-500'">
               {{ phoneCharsInfo.text }}
             </p>
             <p v-if="!phoneRestError && !phoneRest.value" class="text-xs text-gray-500 mt-1">
             </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Электронная почта *</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              required
              autocomplete="email"
            />
          </div>

         <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль *</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400"
                :class="[
                  passwordMismatchError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                ]"
                required
                autocomplete="new-password"
              />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль *</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="••••••••"
                class="w-full px-4 py-2 border rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 shadow-sm placeholder-gray-400"
                :class="[
                  passwordMismatchError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                ]"
                required
                autocomplete="new-password"
                aria-invalid="passwordMismatchError"
                aria-describedby="password-match-error"
              />
              <p v-if="passwordMismatchError" id="password-match-error" class="mt-1 text-xs text-red-600">Пароли не совпадают.</p>
            </div>
          </div>

          <p v-if="genericApiError" class="text-sm text-red-600 text-center -mb-2 sm:-mb-1">
              {{ genericApiError }}
          </p>

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

.bg-black\/60 {
    background-color: rgba(0, 0, 0, 0.6);
}

.backdrop-blur-sm {
    @supports (backdrop-filter: blur(4px)) {
        backdrop-filter: blur(4px);
    }
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
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

#registerModal > div::-webkit-scrollbar {
  width: 6px;
}
#registerModal > div::-webkit-scrollbar-track {
  background: transparent;
}
#registerModal > div::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.400');
  border-radius: 3px;
  border: 1px solid theme('colors.white');
}

.border-red-500 {
  border-color: theme('colors.red.500');
}
.focus\:border-red-500:focus {
  border-color: theme('colors.red.500');
}
.focus\:ring-red-500:focus {
  --tw-ring-color: theme('colors.red.500');
   box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
}
.text-red-600 {
    color: theme('colors.red.600');
}
.text-green-600 {
    color: theme('colors.green.600');
}
</style>