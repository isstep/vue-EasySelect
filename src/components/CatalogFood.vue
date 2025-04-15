<script setup>
import { inject, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { closeCatalog } = inject('cartFoodActions')

const catalog = [
  {
    title: 'Овощи и фрукты',
    subcategories: [
      {
        category: 'Овощи',
        subcategories: [
          'Томаты',
          'Огурцы',
          'Перец',
          'Морковь',
          'Капуста белокочанная',
          'Брокколи',
          'Цветная капуста'
        ]
      },
      { category: 'Зелень', subcategories: ['Салат', 'Шпинат', 'Руккола', 'Петрушка', 'Укроп'] },
      { category: 'Фрукты', subcategories: ['Яблоки', 'Груши', 'Бананы', 'Апельсины'] },
      { category: 'Ягоды', subcategories: ['Клубника', 'Малина', 'Черника'] },
      { category: 'Косточковые фрукты', subcategories: ['Персики', 'Сливы', 'Вишня'] },
      { category: 'Тропические фрукты', subcategories: ['Манго', 'Киви', 'Ананас'] },
      { category: 'Сушеные фрукты', subcategories: ['Изюм', 'Курага', 'Чернослив'] }
    ]
  },
  {
    title: 'Молочные продукты',
    subcategories: [
      {
        category: 'Молоко',
        subcategories: ['Пастеризованное', 'Ультрапастеризованное', 'Органическое', 'Безлактозное']
      },
      {
        category: 'Альтернативное молоко',
        subcategories: ['Соевое', 'Миндальное', 'Овсяное', 'Кокосовое']
      },
      { category: 'Творог', subcategories: ['Классический', 'Обезжиренный', 'Зерненый'] },
      {
        category: 'Сыры',
        subcategories: [
          'Твердые (Чеддер, Гауда)',
          'Полутвердые (Российский, Эдам)',
          'Мягкие (Бри, Камамбер)',
          'Рассольные (Фета, Сулугуни)'
        ]
      },
      {
        category: 'Йогурты',
        subcategories: ['Натуральные (Без добавок)', 'Фруктовые', 'Питьевые', 'Греческие']
      },
      {
        category: 'Сметана и сливки',
        subcategories: ['Сметана (10%, 15%, 20%)', 'Сливки (10%, 20%, 33%, для взбивания)']
      },
      { category: 'Кисломолочные напитки', subcategories: ['Кефир', 'Ряженка', 'Айран', 'Тан'] },
      { category: 'Десерты', subcategories: ['Творожки', 'Сырковые массы', 'Муссы'] }
    ]
  },
  {
    title: 'Мясные продукты',
    subcategories: [
      {
        category: 'Говядина',
        subcategories: ['Вырезка', 'Стейки (Рибай, Стриплойн)', 'Фарш', 'Ребра', 'Лопатка']
      },
      {
        category: 'Свинина',
        subcategories: ['Шейка', 'Корейка', 'Лопатка', 'Фарш', 'Ребра', 'Бекон']
      },
      {
        category: 'Птица',
        subcategories: [
          'Курица (Тушка, Филе, Крылья, Бедра)',
          'Индейка (Филе, Фарш)',
          'Утка',
          'Гусь'
        ]
      },
      { category: 'Фарш', subcategories: ['Говяжий', 'Свиной', 'Куриный', 'Индейки', 'Смешанный'] },
      {
        category: 'Колбасные изделия',
        subcategories: [
          'Вареные колбасы (Докторская, Молочная)',
          'Полукопченые колбасы (Краковская, Сервелат)',
          'Сырокопченые колбасы (Салями)',
          'Сосиски и сардельки'
        ]
      },
      { category: 'Деликатесы', subcategories: ['Ветчина', 'Буженина', 'Карбонад', 'Копчености'] },
      {
        category: 'Полуфабрикаты',
        subcategories: ['Пельмени', 'Манты', 'Котлеты', 'Блинчики с мясом']
      },
      { category: 'Субпродукты', subcategories: ['Печень', 'Сердце', 'Почки', 'Язык'] }
    ]
  },
  {
    title: 'Хлебные изделия',
    subcategories: [
      { category: 'Булочки', subcategories: ['Сладкие', 'Сорубной', 'Тостовый'] },
      { category: 'Киноа', subcategories: ['Белая', 'Красная'] },
      {
        category: 'Булочки',
        subcategories: ['Сдобные', 'Дляленые', 'Для гамбургеров', 'Для хот-догов']
      },
      { category: 'Баранки и сушки', subcategories: ['С маком', 'С солью', 'Простые'] }
    ]
  },
  {
    title: 'Напитки',
    subcategories: [
      {
        category: 'Соки',
        subcategories: [
          'Фруктовые (Яблочный, Апельсиновый, Виноградный)',
          'Овощные (Томатный, Морковный)',
          'Смешанные'
        ]
      },
      {
        category: 'Чай',
        subcategories: ['Черный', 'Зеленый', 'Белый', 'Травяной (Ромашка, Мята)', 'Фруктовый']
      },
      {
        category: 'Кофе',
        subcategories: ['Зерновой', 'Молотый', 'Растворимый', 'Капсульный', 'Кофе без кофеина']
      },
      {
        category: 'Газированные напитки',
        subcategories: ['Кола', 'Лимонад', 'Тоник', 'Газированная вода', 'Энергетики']
      },
      {
        category: 'Вода',
        subcategories: [
          'Минеральная (Газированная, Негазированная)',
          'Питьевая (Очищенная, Артезианская)'
        ]
      },
      {
        category: 'Морсы и компоты',
        subcategories: [
          'Клюквенный морс',
          'Брусничный морс',
          'Компот из сухофруктов',
          'Ягодный компот'
        ]
      },
      {
        category: 'Растительные напитки',
        subcategories: ['Соевое молоко', 'Миндальное молоко', 'Овсяное молоко', 'Кокосовое молоко']
      },
      {
        category: 'Концентраты напитков',
        subcategories: ['Сиропы', 'Растворимые напитки (Чай, Какао, Кисель)']
      }
    ]
  },

  {
    title: 'Другое',
    subcategories: [
  { "category": "Соки и нектары", "subcategories": ["Апельсиновый", "Яблочный", "Томатный", "Мультифрукт", "Виноградный"] },
  { "category": "Чай", "subcategories": ["Чёрный (Английский завтрак, Дарджилинг)", "Зелёный (Сенча, Ганпаудер)", "Травяной (Ромашка, Мята)", "Фруктовый"] },
  { "category": "Кофе", "subcategories": ["Зерновой", "Молотый", "Растворимый", "В капсулах"] },
  { "category": "Газированные напитки", "subcategories": ["Кола", "Лимонад", "Тоник", "Сладкая газированная вода"] },
  { "category": "Вода", "subcategories": ["Минеральная (Газированная, Негазированная)", "Питьевая (Очищенная, Артезианская)"] },
  { "category": "Спортивное питание", "subcategories": ["Протеиновые батончики", "Энергетические гели", "Изотоники"] },
  { "category": "Консервы", "subcategories": ["Овощные", "Фруктовые", "Мясные", "Рыбные"] },
  { "category": "Соусы и приправы", "subcategories": ["Кетчуп", "Майонез", "Горчица", "Соевый соус", "Растительное масло"] }
]
  }
]

const activeCategory = ref(null)
const router = useRouter()

const handleCategoryMouseEnter = (category) => {
  activeCategory.value = category
}

const generateNumericId = (text) => {
  return text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

const navigateToCategory = (category) => {
  const categoryId = generateNumericId(category.title)
  router.push(`/catalog/${categoryId}`)
}

const navigateToItem = (item) => {
  const itemId = generateNumericId(item)
  router.push(`/catalog/${itemId}`)
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
    <div
      @click="closeCatalog"
      class="fixed top-0 left-0 h-full w-full bg-black opacity-80 cursor-pointer z-30"
    >
      <button
        @click="closeCatalog"
        class="absolute bottom-10 left-1/2 mt-[44em] transform -translate-x-1/2 text-gray-500"
      >
        Закрыть каталог
      </button>
    </div>
    <div class=""></div>
    <div class="relative flex">
      <div class="fixed bg-white w-full h-full fixed p-4 bottom-24 z-40">
        <ul class="px-10 mt-[11.3em] mt-[10.9em] max-w-7xl mx-auto">
          <li
            v-for="(category, index) in catalog"
            :key="category.title"
            class="border-r border-gray-300 w-[15em]"
            @mouseenter="handleCategoryMouseEnter(category.title)"
          >
            <h3
              :id="'category-' + index"
              class="text-xl cursor-pointer rounded-xl px-2 py-2 hover:bg-gray-100 transition"
              @click="navigateToCategory(category)"
            >
              {{ category.title }}
            </h3>
            <div
              v-if="activeCategory === category.title"
              class="max-w-7xl mx-auto fixed ml-[16em] bottom-24 top-[6.3em] bg-white"
            >
              <ul class="flex flex-wrap gap-4">
                <li
                  v-for="subcategory in category.subcategories"
                  :key="subcategory.category"
                  class="w-1/6"
                >
                  <a
                    @click.prevent="navigateToCategory({ title: subcategory.category })"
                    class="text-[17px] hover:text-gray-700 font-semibold cursor-pointer"
                  >
                    {{ subcategory.category }}
                  </a>
                  <ul class="text-gray-600 text-[15px] py-1 font-normal">
                    <li v-for="item in subcategory.subcategories" :key="item">
                      <a
                        @click.prevent="navigateToItem(item)"
                        class="hover:text-gray-800 cursor-pointer"
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

<style scoped>
.flex {
  display: flex;
  flex-wrap: wrap;
}

.flex > li {
  width: 16.6667%;
  margin-right: 10px;
}

.gap-4 {
  gap: 1rem;
}
</style>
