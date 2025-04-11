<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['close']);
const visible = ref(true);

const close = () => {
  visible.value = false;
  emit('close');
};
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 flex z-50 items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      @click.self="close"
    >
      <div class="relative bg-white pt-6 pb-8 px-8 rounded-xl shadow-2xl max-w-sm w-full m-4 animate-slideIn">
        <button
           @click="close"
           class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
           aria-label="Закрыть"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="text-xl font-semibold text-slate-800 mb-2">Требуется вход в аккаунт</h2>
          <p class="text-slate-600 text-sm mb-6">
            Пожалуйста, войдите в систему или зарегистрируйтесь, чтобы продолжить.
          </p>
        </div>

        <div class="space-y-3">
           <router-link
              :to="{ name: 'login' }"
              class="block w-full px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg text-center transition duration-200 ease-in-out hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              @click="close"
           >
             Войти
           </router-link>
           <button
             @click="close"
             class="w-full px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg transition duration-200 ease-in-out hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
           >
             Позже
           </button>
        </div>
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
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}

.backdrop-blur-sm {
    @supports (backdrop-filter: blur(4px)) {
        backdrop-filter: blur(4px);
    }
}

button:focus-visible {
    outline: 2px solid theme('colors.emerald.500');
    outline-offset: 2px;
}
</style>