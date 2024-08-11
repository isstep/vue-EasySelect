<script setup>
const emit = defineEmits(['openDrawer'])
</script>


<template>
  <header class="flex justify-between border-b border-slate-300 px-9 p-1">
    <div class="flex items-center gap-5">
      <img src="/logo.svg" alt="logo" class="w-12" />
      <div>
        <h2 class="text-2xl font-bold">CosmoExpress</h2>
        <p class="text-slate-400">Еда, которая прилетает к вам!</p>
      </div>
    </div>

    <ul class="flex items-center gap-10 gap-3">
      <li @click="() => emit('openDrawer')" class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
        <img src="/public/cart.svg" alt="cart" />
        <b>1205 руб.</b>
      </li>

      <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
        <img src="/public/heart.svg" alt="heart" />
        <span>Закладки</span>
      </li>

      <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
        <img src="/public/profile.svg" alt="profile" />
        <span>Профиль</span>
      </li>
    </ul>
  </header>
</template>
