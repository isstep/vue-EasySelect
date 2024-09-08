<script setup>
import { inject, ref, watch } from 'vue'
const { closeCatalog } = inject('cartFoodActions')

const catalog = [
  {
    title: 'Овощи и фрукты',
    subcategories: ['Овощи', 'Фрукты', 'Зелень', 'Грибы', 'Ягоды']
  },
  {
    title: 'Квашения, соления, салаты',
    subcategories: ['Овощи']
  }
]

const activeCategory = ref(null)
const hoveredCategory = ref(null)

const handleCategoryMouseEnter = (category) => {
  hoveredCategory.value = category
  activeCategory.value = category
}

const handleCategoryMouseLeave = (category) => {
  setTimeout(() => {
    if (hoveredCategory.value === category) {
      activeCategory.value = null
    }
  }, 100)
}

watch(hoveredCategory, (newVal) => {
  if (newVal === null) {
    activeCategory.value = null
  }
})
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full z-40 flex">
    <div
      @click="closeCatalog"
      class="fixed top-0 left-0 h-full w-full bg-black opacity-70 cursor-pointer z-30"
    >
      <button @click="closeCatalog" class="absolute left-1/2 mt-[44em] transform -translate-x-1/2 text-gray-500">
        Закрыть каталог
      </button>
    </div>

    <div class="relative flex">
      <div
        class="bg-white w-full h-[30em] fixed top-10 left-0 p-4 overflow-y-auto z-40 border-r border-gray-200"
      >
        <ul class="absolute px-40 mt-10">
          <li
            v-for="category in catalog"
            :key="category.title"
            class="relative mb-6"
            @mouseenter="handleCategoryMouseEnter(category.title)"
            @mouseleave="handleCategoryMouseLeave(category.title)"
          >
            <h3
              class="text-xl font-semibold cursor-pointer hover:text-blue-500 transition"
            >
              {{ category.title }}
            </h3>
            <div
              v-if="activeCategory === category.title"
              class="absolute left-80 top-0 w-80 bg-white border-l border-gray-200"
            >
              <ul class="grid grid-cols-3 gap-4 p-4">
                <li
                  v-for="subcategory in category.subcategories"
                  :key="subcategory"
                  class="cursor-pointer hover:bg-gray-100 transition"
                >
                  {{ subcategory }}
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
