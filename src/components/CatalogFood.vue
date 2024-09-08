<script setup>
import { inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const { closeCatalog } = inject('cartFoodActions')

const catalog = [
  {
    title: 'Овощи и фрукты',
    subcategories: ['Овощи', 'Фрукты', 'Зелень', 'Грибы', 'Ягоды', 'Квашения, соления, салаты']
  },
  {
    title: 'Молоко и яйца',
    subcategories: ['Мороженое', 'Яйца', 'Молоко, сливки', 'Кефир, кисломолочные изделия', 'Масло, маргарин', 'Сметана, творог', 'Сыры', 'Йогурты, десерты, каши']
  },
  {
    title: 'Хлеб и выпечка',
    subcategories: ['Хлеб', 'Булочки', 'Круассаны', 'Пироги', 'Печенье', 'Сухари']
  },
  {
    title: 'Шеф-онлайн',
    subcategories: ['Рецепты', 'Кулинарные советы', 'Видеоуроки', 'Кулинарные техники']
  },
  {
    title: 'Мясо, птица и колбасы',
    subcategories: ['Говядина', 'Свинина', 'Курица', 'Индейка', 'Колбасы', 'Копчености']
  },
  {
    title: 'Рыба и морепродукты',
    subcategories: ['Рыба', 'Креветки', 'Мидии', 'Кальмары', 'Осьминоги', 'Рыбные консервы']
  },
  {
    title: 'Напитки',
    subcategories: ['Соки', 'Газированные напитки', 'Минеральная вода', 'Чай', 'Кофе', 'Энергетики']
  },
  {
    title: 'Сладости',
    subcategories: ['Шоколад', 'Конфеты', 'Торты', 'Пирожные', 'Сладкие закуски']
  },
  {
    title: 'Замороженные продукты',
    subcategories: ['Замороженные овощи', 'Замороженные фрукты', 'Замороженные полуфабрикаты', 'Мороженое']
  },
  {
    title: 'Косметика и гигиена',
    subcategories: ['Уход за лицом', 'Уход за телом', 'Шампуни и кондиционеры', 'Гигиенические средства', 'Парфюмерия']
  },
  {
    title: 'Бытовая химия',
    subcategories: ['Моющее средство', 'Стиральные порошки', 'Чистящие средства', 'Освежители воздуха']
  },
  {
    title: 'Продукты для животных',
    subcategories: ['Корм для собак', 'Корм для кошек', 'Игрушки для животных', 'Средства ухода']
  }
];


const activeCategory = ref(null)
const hoveredCategory = ref(null)

const handleCategoryMouseEnter = (category) => {
  hoveredCategory.value = category
  activeCategory.value = category
}

const handleCategoryMouseLeave = () => {
  setTimeout(() => {
    if (hoveredCategory.value === null) {
      activeCategory.value = null
    }
  }, 100)
}

const handleMouseEnterOnCatalog = () => {
  hoveredCategory.value = activeCategory.value
}

const handleMouseLeaveOnCatalog = () => {
  hoveredCategory.value = null
}

const route = useRoute()

watch(() => route.path, () => {
  closeCatalog()
})

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

    <div 
      class="relative flex"
      @mouseenter="handleMouseEnterOnCatalog"
      @mouseleave="handleMouseLeaveOnCatalog"
    >
      <div
        class="bg-white w-full h-[40em] fixed top-10 left-0 p-4 overflow-y-auto z-40 border-r border-gray-200"
      >
        <ul class="absolute px-40 mt-10">
          <li
            v-for="category in catalog"
            :key="category.title"
            class="relative"
            @mouseenter="handleCategoryMouseEnter(category.title)"
            @mouseleave="handleCategoryMouseLeave"
          >
            <h3
              class="text-xl cursor-pointer rounded-xl px-2 py-2 hover:bg-gray-100 transition "
            >
              {{ category.title }}
            </h3>
            <div
              v-if="activeCategory === category.title"
              class="absolute left-80 top-0 w-80 bg-white border-l border-gray-200"
            >
              <ul class="grid grid-cols-3 gap-6 p-5">
                <li
                  v-for="subcategory in category.subcategories"
                  :key="subcategory"
                  class="cursor-pointer font-semibold"
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
