<script setup>
import { inject, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { closeCatalog } = inject('cartFoodActions')

const catalog = [
  {
    title: 'Овощи и фрукты',
    subcategories: [
      { category: 'Овощи', subcategories: ['Помидоры', 'Морковь', 'Огурцы'] },
      { category: 'Фрукты', subcategories: ['Яблоки', 'Бананы', 'Виноград'] },
      { category: 'Зелень', subcategories: ['Петрушка', 'Кинза'] },
      { category: 'Грибы', subcategories: ['Шампиньоны', 'Шиитаке'] },
      { category: 'Ягоды', subcategories: ['Клубника', 'Черника'] }
    ]
  },
  {
    title: 'Молочные продукты',
    subcategories: [
      { category: 'Молоко', subcategories: ['Коровье', 'Козье', 'Соевое'] },
      { category: 'Сыры', subcategories: ['Творожный', 'Чеддер', 'Фета'] },
      { category: 'Йогурты', subcategories: ['Натуральный', 'Фруктовый', 'Греческий'] },
      { category: 'Сметана', subcategories: ['Жирная', 'Обезжиренная'] }
    ]
  },
  {
    title: 'Мясные продукты',
    subcategories: [
      { category: 'Говядина', subcategories: ['Филе', 'Стейк', 'Ребра'] },
      { category: 'Свинина', subcategories: ['Котлеты', 'Шейка', 'Бекон'] },
      { category: 'Птица', subcategories: ['Курица', 'Индейка', 'Утка'] },
      { category: 'Колбасы', subcategories: ['Вареная', 'Копченая', 'Сухая'] }
    ]
  },
  {
    title: 'Зерновые и крупы',
    subcategories: [
      { category: 'Рис', subcategories: ['Белый', 'Коричневый', 'Дикий'] },
      { category: 'Киноа', subcategories: ['Белая', 'Красная'] },
      { category: 'Гречка', subcategories: ['Зеленая', 'Обжаренная'] },
      { category: 'Овсянка', subcategories: ['Пластинчатая', 'Мелкая'] }
    ]
  },
  {
    title: 'Напитки',
    subcategories: [
      { category: 'Соки', subcategories: ['Апельсиновый', 'Яблочный', 'Грушевый'] },
      { category: 'Чай', subcategories: ['Чёрный', 'Зелёный', 'Травяной'] },
      { category: 'Кофе', subcategories: ['Эспрессо', 'Американо', 'Латте'] },
      { category: 'Газированные напитки', subcategories: ['Кола', 'Лимонад', 'Спрайт'] }
    ]
  }
]

const activeCategory = ref(null)
const router = useRouter()

const handleCategoryMouseEnter = (category) => {
  activeCategory.value = category
}

const generateNumericId = (text) => {
  return text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

const navigateToCategory = (category) => {
  const categoryId = generateNumericId(category.title);
  router.push(`/catalog/${categoryId}`);
}

const navigateToItem = (item) => {
  const itemId = generateNumericId(item);
  router.push(`/catalog/${itemId}`);
}

const route = useRoute()

watch(
  () => route.path,
  () => {
    closeCatalog()
  }
)

onMounted(() => {
  activeCategory.value = catalog[0].title
})
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full z-40 flex">
    <div @click="closeCatalog" class="fixed top-0 left-0 h-full w-full bg-black opacity-80 cursor-pointer z-30">
      <button @click="closeCatalog" class="absolute bottom-10 left-1/2 mt-[44em] transform -translate-x-1/2 text-gray-500">
        Закрыть каталог
      </button>
    </div>

    <div class="relative flex">
      <div class="fixed bg-white w-full h-full fixed p-4  bottom-24  z-40">
        <ul class="px-10 mt-[5.3em] mt-[10.8em] max-w-7xl mx-auto">
          <li v-for="(category, index) in catalog" :key="category.title" class="border-r border-gray-300 w-[15em]" @mouseenter="handleCategoryMouseEnter(category.title)">
            <h3
              :id="'category-' + index"
              class="text-xl cursor-pointer rounded-xl px-2 py-2 hover:bg-gray-100 transition "
              @click="navigateToCategory(category)"
            >
              {{ category.title }}
            </h3>
            <div v-if="activeCategory === category.title" class="max-w-7xl  mx-auto fixed ml-[16em] top-[6.3em] bg-white">
              <ul class="flex space-x-20">
                <li v-for="subcategory in category.subcategories" :key="subcategory.category" class="mt-0">
                  <a @click.prevent="navigateToCategory({ title: subcategory.category })" class="text-[17px] hover:text-green-700 font-semibold cursor-pointer">
                    {{ subcategory.category }}
                  </a>
                  <ul class="text-gray-800 text-[15px] py-1 font-normal ">
                    <li v-for="item in subcategory.subcategories" :key="item">
                      <a @click.prevent="navigateToItem(item)" class="hover:text-green-700 cursor-pointer">
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