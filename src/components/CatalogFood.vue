<script setup>
import { inject, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const { closeCatalog } = inject('cartFoodActions');

const catalog = [
  {
    title: 'Овощи и фрукты',
    subcategories: [
      { category: 'Овощи', subcategories: ['Помидоры', 'Морковь', 'Огурцы'] },
      { category: 'Фрукты', subcategories: ['Яблоки', 'Бананы', 'Виноград'] },
      { category: 'Зелень', subcategories: ['Петрушка', 'Кинза'] },
      { category: 'Грибы', subcategories: ['Шампиньоны', 'Шиитаке'] },
      { category: 'Ягоды', subcategories: ['Клубника', 'Черника'] },
    ],
  },
  {
    title: 'Молочные продукты',
    subcategories: [
      { category: 'Молоко', subcategories: ['Коровье', 'Козье', 'Соевое'] },
      { category: 'Сыры', subcategories: ['Творожный', 'Чеддер', 'Фета'] },
      { category: 'Йогурты', subcategories: ['Натуральный', 'Фруктовый', 'Греческий'] },
      { category: 'Сметана', subcategories: ['Жирная', 'Обезжиренная'] },
    ],
  },
  {
    title: 'Мясные продукты',
    subcategories: [
      { category: 'Говядина', subcategories: ['Филе', 'Стейк', 'Ребра'] },
      { category: 'Свинина', subcategories: ['Котлеты', 'Шейка', 'Бекон'] },
      { category: 'Птица', subcategories: ['Курица', 'Индейка', 'Утка'] },
      { category: 'Колбасы', subcategories: ['Вареная', 'Копченая', 'Сухая'] },
    ],
  },
  {
    title: 'Зерновые и крупы',
    subcategories: [
      { category: 'Рис', subcategories: ['Белый', 'Коричневый', 'Дикий'] },
      { category: 'Киноа', subcategories: ['Белая', 'Красная'] },
      { category: 'Гречка', subcategories: ['Зеленая', 'Обжаренная'] },
      { category: 'Овсянка', subcategories: ['Пластинчатая', 'Мелкая'] },
    ],
  },
  {
    title: 'Напитки',
    subcategories: [
      { category: 'Соки', subcategories: ['Апельсиновый', 'Яблочный', 'Грушевый'] },
      { category: 'Чай', subcategories: ['Чёрный', 'Зелёный', 'Травяной'] },
      { category: 'Кофе', subcategories: ['Эспрессо', 'Американо', 'Латте'] },
      { category: 'Газированные напитки', subcategories: ['Кола', 'Лимонад', 'Спрайт'] },
    ],
  },
];

const activeCategory = ref(null); 

const handleCategoryMouseEnter = (category) => {
  activeCategory.value = category; 
};

const handleMouseLeave = () => {
  activeCategory.value = null; 
};

const route = useRoute();

watch(
  () => route.path,
  () => {
    closeCatalog();
  }
);

onMounted(() => {
  activeCategory.value = catalog[0].title; 
});
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full z-40 flex" @mouseleave="handleMouseLeave">
    <div
      @click="closeCatalog"
      class="fixed top-0 left-0 h-full w-full bg-black opacity-70 cursor-pointer z-30"
    >
      <button
        @click="closeCatalog"
        class="absolute left-1/2 mt-[44em] transform -translate-x-1/2 text-gray-500"
      >
        Закрыть каталог
      </button>
    </div>

    <div class="relative flex">
      <div class="bg-white w-full h-[43em] fixed p-4 overflow-y-auto z-40">
        <ul class="px-10 mt-[4.4em] max-w-7xl mx-auto">
          <li 
            v-for="category in catalog"
            :key="category.title"
            class="relative w-[15em] border-b border-gray-200"
            @mouseenter="handleCategoryMouseEnter(category.title)"
          >
            <h3 class="text-xl cursor-pointer rounded-xl px-2 py-2 hover:bg-gray-100 transition">
              {{ category.title }}
            </h3>
            <div
              v-if="activeCategory === category.title"
              class="absolute left-[15em] top-0 w-80 bg-white shadow-lg z-50"
            >
              <ul class="grid grid-cols-1">
                <li
                  v-for="subcategory in category.subcategories"
                  :key="subcategory.category"
                  class="mt-2"
                >
                  <h4
                    class="text-[17px] font-semibold cursor-pointer"
                  >
                    {{ subcategory.category }}
                  </h4>
                  <ul class="text-gray-800 text-[15px] py-1 font-normal">
                    <li 
                      v-for="item in subcategory.subcategories" 
                      :key="item"
                    >
                      <a 
                        href="#"
                        class="hover:text-blue-600"
                      >
                        {{ item }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
