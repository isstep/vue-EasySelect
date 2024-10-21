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
      class="fixed inset-0 flex z-50 items-center justify-center bg-black bg-opacity-60 animate-fadeIn"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full animate-slideIn">
        <h2 class="text-2xl font-bold text-green-600 mb-4">Авторизация</h2>
        <p class="text-gray-700 mb-6">
          Вам нужно авторизоваться, чтобы продолжить действия.
        </p>
        <router-link
          to="/login"
          class="block w-full mb-4 px-4 py-2 bg-green-600 text-white rounded text-center transition duration-300 ease-in-out hover:bg-green-500 hover:scale-105"
          @click="close"
        >
          Перейти к авторизации
        </router-link>
        <button
          @click="close"
          class="w-full px-4 py-2 bg-gray-600 text-white rounded transition duration-300 ease-in-out hover:bg-gray-500 hover:scale-105"
        >
          Закрыть
        </button>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.bg-white {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  font-family: 'Arial', sans-serif;
}

p {
  font-size: 1rem;
  line-height: 1.5;
}

button,
.router-link {
  border-radius: 8px;
  transition: all 0.3s ease;
}

button:hover,
.router-link:hover {
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.5s ease-in-out forwards;
}
</style>
