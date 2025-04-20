<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('/')
  }, 1700)
})
</script>

<template>
  <div class="flex justify-center items-center h-[80vh] bg-gradient-to-br">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-green-600 animate-easy-select">Почта подтверждена</h1>
    </div>
  </div>
  <router-link to="/"> </router-link>
</template>

<style scoped>
@keyframes easySelectAnimation {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  50% {
    opacity: 0.5;
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-easy-select {
  animation: easySelectAnimation 1.5s ease-in-out forwards;
}
</style>
