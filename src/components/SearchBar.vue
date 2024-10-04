<!-- SearchBar.vue -->
<script setup>
import { ref, watch } from 'vue'
import debounce from 'lodash.debounce'

// Определяем событие 'update-search-query'
const emit = defineEmits(['update-search-query'])

const searchQuery = ref('')

// Обработчик ввода с дебаунсом
const onChangeSearchInput = debounce((event) => {
  searchQuery.value = event.target.value
}, 500)

// Наблюдаем за изменением searchQuery и эмитируем событие
watch(searchQuery, (newQuery) => {
  emit('update-search-query', newQuery)
})
</script>

<template>
  <div class="relative">
    <img
      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
      src="/search.svg"
      alt="search icon"
    />
    <input
      @input="onChangeSearchInput"
      class="border border-gray-300 rounded-md py-2 pl-9 pr-4 outline-none text-sm sm:text-base focus:border-gray-400 focus:ring focus:ring-gray-300"
      type="text"
      placeholder="Поиск..."
    />
  </div>
</template>
