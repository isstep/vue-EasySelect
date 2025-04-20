<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
 setTimeout(() => {
    router.push('/')
  }, 2500) 
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 p-4">
    <div class="transform transition-all duration-1000 ease-out scale-100 opacity-100 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto mb-4 h-20 w-20 text-white animate-pulse-grow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 class="animate-slide-in-text text-4xl font-extrabold text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.2)] sm:text-5xl md:text-6xl">
        Почта подтверждена!
      </h1>
      <p class="mt-3 text-lg text-white/80 opacity-0 animate-fade-in-delay">
        Перенаправляем на главную...
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulseGrow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

.animate-pulse-grow {
  animation: pulseGrow 1.8s ease-in-out infinite;
}

@keyframes slideInText {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-in-text {
  animation: slideInText 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
  opacity: 0;
}


@keyframes fadeInDelay {
  0% {
    opacity: 0;
  }
  60% { 
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in-delay {
  animation: fadeInDelay 1.5s ease-in forwards;
   animation-delay: 0.6s;
   opacity: 0;
}

</style>