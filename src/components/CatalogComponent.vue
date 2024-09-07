<script setup>
import {inject } from 'vue'

const { closeCatalog } = inject('cartFoodActions')
</script>

<template>
  <div @click="closeCatalog" class="fixed top-0 left-0 h-full w-full bg-black z-50 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-50 p-8 overflow-y-auto"></div>
</template>
