<script setup>
import { ref, onMounted } from 'vue'

const categories = [
  { id: 13077, name: 'Овощи и фрукты' },
  { id: 2127, name: 'Молочные продукты' },
  { id: 17397, name: 'Мясные продукты' },
  { id: 13211, name: 'Хлебные изделия' },
  { id: 15165, name: 'Напитки' },
  { id: 6595, name: 'Другое' },
  { id: 5391, name: 'Овощи' },
  { id: 2256, name: 'Зелень' },
  { id: 6785, name: 'Фрукты' },
  { id: 6565, name: 'Ягоды' },
  { id: 17953, name: 'Косточковые фрукты' },
  { id: 19644, name: 'Тропические фрукты' },
  { id: 15654, name: 'Сушеные фрукты' },
  { id: 6648, name: 'Молоко' },
  { id: 19585, name: 'Альтернативное молоко' },
  { id: 6943, name: 'Творог' },
  { id: 6528, name: 'Сыры' },
  { id: 7587, name: 'Йогурты' },
  { id: 17564, name: 'Сметана и сливки' },
  { id: 18788, name: 'Кисломолочные напитки' },
  { id: 7789, name: 'Десерты' },
  { id: 7023, name: 'Говядина' },
  { id: 7246, name: 'Свинина' },
  { id: 6846, name: 'Птица' },
  { id: 5512, name: 'Фарш' },
  { id: 16129, name: 'Колбасные изделия' },
  { id: 9683, name: 'Деликатесы' },
  { id: 13990, name: 'Полуфабрикаты' },
  { id: 8021, name: 'Субпродукты' },
  { id: 6601, name: 'Булочки' },
  { id: 5459, name: 'Киноа' },
  { id: 15332, name: 'Баранки и сушки' },
  { id: 5639, name: 'Соки' },
  { id: 2272, name: 'Чай' },
  { id: 5482, name: 'Кофе' },
  { id: 19560, name: 'Газированные напитки' },
  { id: 5344, name: 'Вода' },
  { id: 15620, name: 'Морсы и компоты' },
  { id: 18762, name: 'Растительные напитки' },
  { id: 19066, name: 'Концентраты напитков' },
  { id: 15753, name: 'Соки и нектары' },
  { id: 21047, name: 'Спортивное питание' },
  { id: 8956, name: 'Консервы' },
  { id: 15112, name: 'Соусы и приправы' },
  { id: 6489, name: 'Томаты' },
  { id: 6501, name: 'Огурцы' },
  { id: 6620, name: 'Перец' },
  { id: 7120, name: 'Морковь' },
  { id: 20115, name: 'Капуста белокочанная' },
  { id: 7664, name: 'Брокколи' },
  { id: 18936, name: 'Цветная капуста' },
  { id: 6800, name: 'Салат' },
  { id: 7439, name: 'Шпинат' },
  { id: 7314, name: 'Руккола' },
  { id: 7824, name: 'Петрушка' },
  { id: 6923, name: 'Укроп' },
  { id: 6565, name: 'Яблоки' },
  { id: 6643, name: 'Груши' },
  { id: 6865, name: 'Бананы' },
  { id: 17660, name: 'Апельсины' },
  { id: 7849, name: 'Клубника' },
  { id: 6954, name: 'Малина' },
  { id: 17198, name: 'Черника' },
  { id: 7565, name: 'Персики' },
  { id: 6546, name: 'Сливы' },
  { id: 7241, name: 'Вишня' },
  { id: 6480, name: 'Манго' },
  { id: 5346, name: 'Киви' },
  { id: 7308, name: 'Ананас' },
  { id: 6366, name: 'Изюм' },
  { id: 6845, name: 'Курага' },
  { id: 16317, name: 'Чернослив' },
  { id: 15117, name: 'Пастеризованное' },
  { id: 20227, name: 'Ультрапастеризованное' },
  { id: 10057, name: 'Органическое' },
  { id: 15074, name: 'Безлактозное' },
  { id: 6511, name: 'Соевое' },
  { id: 16908, name: 'Миндальное' },
  { id: 6781, name: 'Овсяное' },
  { id: 16310, name: 'Кокосовое' },
  { id: 11821, name: 'Классический' },
  { id: 10542, name: 'Обезжиренный' },
  { id: 10225, name: 'Зерненый' },
  { id: 22486, name: 'Твердые (Чеддер, Гауда)' },
  { id: 23020, name: 'Полутвердые (Российский, Эдам)' },
  { id: 18154, name: 'Мягкие (Бри, Камамбер)' },
  { id: 22107, name: 'Рассольные (Фета, Сулугуни)' },
  { id: 21398, name: 'Натуральные (Без добавок)' },
  { id: 11090, name: 'Фруктовые' },
  { id: 8366, name: 'Питьевые' },
  { id: 10359, name: 'Греческие' },
  { id: 15368, name: 'Сметана (10%, 15%, 20%)' },
  { id: 14841, name: 'Сливки (10%, 20%, 33%, для взбивания)' },
  { id: 6593, name: 'Кефир' },
  { id: 8008, name: 'Ряженка' },
  { id: 5032, name: 'Айран' },
  { id: 5108, name: 'Тан' },
  { id: 7365, name: 'Творожки' },
  { id: 15632, name: 'Сырковые массы' },
  { id: 6872, name: 'Муссы' },
  { id: 7376, name: 'Вырезка' },
  { id: 17233, name: 'Стейки (Рибай, Стриплойн)' },
  { id: 5512, name: 'Фарш' },
  { id: 5573, name: 'Ребра' },
  { id: 8236, name: 'Лопатка' },
  { id: 6741, name: 'Шейка' },
  { id: 7107, name: 'Корейка' },
  { id: 16978, name: 'Курица (Тушка, Филе, Крылья, Бедра)' },
  { id: 15878, name: 'Индейка (Филе, Фарш)' },
  { id: 5348, name: 'Утка' },
  { id: 5265, name: 'Гусь' },
  { id: 7771, name: 'Говяжий' },
  { id: 7994, name: 'Свиной' },
  { id: 6835, name: 'Куриный' },
  { id: 7574, name: 'Индейки' },
  { id: 9774, name: 'Смешанный' },
  { id: 21805, name: 'Вареные колбасы (Докторская, Молочная)' },
  { id: 24892, name: 'Полукопченые колбасы (Краковская, Сервелат)' },
  { id: 21800, name: 'Сырокопченые колбасы (Салями)' },
  { id: 17546, name: 'Сосиски и сардельки' },
  { id: 7811, name: 'Ветчина' },
  { id: 9702, name: 'Буженина' },
  { id: 10185, name: 'Карбонад' },
  { id: 16859, name: 'Копчености' },
  { id: 7638, name: 'Пельмени' },
  { id: 6448, name: 'Манты' },
  { id: 7208, name: 'Котлеты' },
  { id: 18492, name: 'Блинчики с мясом' },
  { id: 7091, name: 'Печень' },
  { id: 7062, name: 'Сердце' },
  { id: 6552, name: 'Почки' },
  { id: 6681, name: 'Язык' },
  { id: 7128, name: 'Сладкие' },
  { id: 7920, name: 'Сорубной' },
  { id: 7829, name: 'Тостовый' },
  { id: 5377, name: 'Белая' },
  { id: 7250, name: 'Красная' },
  { id: 7150, name: 'Сдобные' },
  { id: 9152, name: 'Дляленые' },
  { id: 17724, name: 'Для гамбургеров' },
  { id: 16943, name: 'Для хот-догов' },
  { id: 6956, name: 'С маком' },
  { id: 7236, name: 'С солью' },
  { id: 7148, name: 'Простые' },
  { id: 22755, name: 'Фруктовые (Яблочный, Апельсиновый, Виноградный)' },
  { id: 20578, name: 'Овощные (Томатный, Морковный)' },
  { id: 9409, name: 'Смешанные' },
  { id: 6780, name: 'Черный' },
  { id: 7124, name: 'Зеленый' },
  { id: 6490, name: 'Белый' },
  { id: 20287, name: 'Травяной (Ромашка, Мята)' },
  { id: 10789, name: 'Фруктовый' },
  { id: 7272, name: 'Зерновой' },
  { id: 7280, name: 'Молотый' },
  { id: 9406, name: 'Растворимый' },
  { id: 10174, name: 'Капсульный' },
  { id: 18379, name: 'Кофе без кофеина' },
  { id: 5246, name: 'Кола' },
  { id: 7729, name: 'Лимонад' },
  { id: 7202, name: 'Тоник' },
  { id: 17508, name: 'Газированная вода' },
  { id: 10472, name: 'Энергетики' },
  { id: 18769, name: 'Минеральная (Газированная, Негазированная)' },
  { id: 17771, name: 'Питьевая (Очищенная, Артезианская)' },
  { id: 15570, name: 'Клюквенный морс' },
  { id: 15918, name: 'Брусничный морс' },
  { id: 18839, name: 'Компот из сухофруктов' },
  { id: 16030, name: 'Ягодный компот' },
  { id: 15830, name: 'Соевое молоко' },
  { id: 16908, name: 'Миндальное молоко' },
  { id: 6781, name: 'Овсяное молоко' },
  { id: 16310, name: 'Кокосовое молоко' },
  { id: 6987, name: 'Сиропы' },
  { id: 20049, name: 'Растворимые напитки (Чай, Какао, Кисель)' },
  { id: 15753, name: 'Соки и нектары' },
  { id: 2272, name: 'Чай' },
  { id: 5482, name: 'Кофе' },
  { id: 19560, name: 'Газированные напитки' },
  { id: 5344, name: 'Вода' },
  { id: 21047, name: 'Спортивное питание' },
  { id: 8956, name: 'Консервы' },
  { id: 15112, name: 'Соусы и приправы' },
  { id: 11565, name: 'Апельсиновый' },
  { id: 10637, name: 'Яблочный' },
  { id: 10856, name: 'Томатный' },
  { id: 12459, name: 'Мультифрукт' },
  { id: 12554, name: 'Виноградный' },
  { id: 22370, name: 'Чёрный (Английский завтрак, Дарджилинг)' },
  { id: 20994, name: 'Зелёный (Сенча, Ганпаудер)' },
  { id: 20287, name: 'Травяной (Ромашка, Мята)' },
  { id: 10789, name: 'Фруктовый' },
  { id: 7272, name: 'Зерновой' },
  { id: 7280, name: 'Молотый' },
  { id: 9406, name: 'Растворимый' },
  { id: 10174, name: 'В капсулах' },
  { id: 5246, name: 'Кола' },
  { id: 7729, name: 'Лимонад' },
  { id: 7202, name: 'Тоник' },
  { id: 19978, name: 'Сладкая газированная вода' },
  { id: 18769, name: 'Минеральная (Газированная, Негазированная)' },
  { id: 17771, name: 'Питьевая (Очищенная, Артезианская)' },
  { id: 23909, name: 'Протеиновые батончики' },
  { id: 16539, name: 'Энергетические гели' },
  { id: 9598, name: 'Изотоники' },
  { id: 8282, name: 'Овощные' },
  { id: 8329, name: 'Фруктовые' },
  { id: 9234, name: 'Мясные' },
  { id: 8164, name: 'Рыбные' },
  { id: 7274, name: 'Кетчуп' },
  { id: 7850, name: 'Майонез' },
  { id: 7157, name: 'Горчица' },
  { id: 15118, name: 'Соевый соус' },
  { id: 16227, name: 'Растительное масло' }
]

const newProduct = ref({
  id: '',
  title: '',
  description: '',
  storageConditions: '',
  price: '',
  discount: '',
  imgUrl: '',
  categoryIds: []
})

const products = ref([])
const idExists = ref(false)
const inputColor = ref('')
const idStatusMessage = ref('')

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newProduct.value.imgUrl = `/food/${file.name}`
  }
}

const generateUniqueId = async () => {
  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/foods')
    if (!response.ok) throw new Error('Ошибка при получении данных')

    const existingProducts = await response.json()
    let newId
    do {
      newId = Math.floor(1000 + Math.random() * 9000)
    } while (existingProducts.some((product) => product.id === newId))

    newProduct.value.id = newId
    inputColor.value = 'green'
    idStatusMessage.value = 'ID доступен'
    idExists.value = false
  } catch (error) {
    console.error(error)
    inputColor.value = 'red'
    idStatusMessage.value = 'Ошибка при генерации ID'
  }
}

const checkId = async () => {
  if (!newProduct.value.id) {
    idStatusMessage.value = ''
    inputColor.value = ''
    idExists.value = false
    return
  }
  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/foods')
    if (!response.ok) throw new Error('Ошибка при получении данных')

    const existingProducts = await response.json()
    idExists.value = existingProducts.some((product) => product.id === Number(newProduct.value.id))

    if (idExists.value) {
      inputColor.value = 'red'
      idStatusMessage.value = 'ID занят'
    } else {
      inputColor.value = 'green'
      idStatusMessage.value = 'ID доступен'
    }
  } catch (error) {
    console.error(error)
    inputColor.value = 'red'
    idStatusMessage.value = 'Ошибка при проверке ID'
  }
}

const saveProduct = async (product) => {
  const productId = Number(product.id)
  if (!productId) {
    console.error('Некорректный ID:', product.id)
    alert('Ошибка: некорректный ID товара.')
    return
  }

  try {
    const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: product.title,
        description: product.description,
        storageConditions: product.storageConditions,
        price: parseFloat(product.price),
        discount: product.discount ? Number(product.discount) : 0,
        categoryIds: product.categoryIds.map(Number),
        imgUrl: product.imgUrl
      })
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Не удалось получить детали ошибки' }))
      console.error('Ошибка от сервера:', errorData)
      throw new Error(
        `Ошибка при сохранении товара (код ${response.status}). ${errorData.message || ''}`
      )
    }

    alert('Товар успешно сохранён!')
    const index = products.value.findIndex((p) => p.id === productId)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        title: product.title,
        description: product.description,
        storageConditions: product.storageConditions,
        price: parseFloat(product.price),
        discount: product.discount ? Number(product.discount) : 0,
        categoryIds: product.categoryIds.map(Number),
        imgUrl: product.imgUrl
      }
    }
  } catch (error) {
    console.error(error)
    alert(`Не удалось сохранить товар: ${error.message}`)
  }
}

const addProduct = async () => {
  if (
    !newProduct.value.id ||
    !newProduct.value.title ||
    !newProduct.value.price ||
    !newProduct.value.imgUrl ||
    !newProduct.value.categoryIds.length
  ) {
    alert('Заполните все обязательные поля (ID, Название, Цена, URL изображения, Категории)')
    return
  }

  await checkId()
  if (idExists.value) {
    alert('Выбранный ID уже занят. Сгенерируйте новый или введите другой.')
    return
  }

  const productToAdd = {
    ...newProduct.value,
    id: Number(newProduct.value.id),
    price: parseFloat(newProduct.value.price),
    discount: newProduct.value.discount ? Number(newProduct.value.discount) : 0,
    categoryIds: newProduct.value.categoryIds.map(Number)
  }

  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToAdd)
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Не удалось получить детали ошибки' }))
      console.error('Ошибка от сервера:', errorData)
      throw new Error(
        `Ошибка при добавлении товара (код ${response.status}). ${errorData.message || ''}`
      )
    }

    const addedProduct = await response.json()

    products.value.push({
      ...addedProduct,
      description: addedProduct.description || '',
      storageConditions: addedProduct.storageConditions || ''
    })

    newProduct.value = {
      id: '',
      title: '',
      description: '',
      storageConditions: '',
      price: '',
      discount: '',
      imgUrl: '',
      categoryIds: []
    }
    idStatusMessage.value = ''
    inputColor.value = ''
    alert('Товар успешно добавлен!')
  } catch (error) {
    console.error(error)
    alert(`Не удалось отправить данные: ${error.message}`)
  }
}

const deleteProduct = async (productId) => {
  if (!confirm(`Вы уверены, что хотите удалить товар с ID ${productId}?`)) {
    return
  }

  try {
    const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${productId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Не удалось получить детали ошибки' }))
      console.error('Ошибка от сервера:', errorData)
      throw new Error(
        `Ошибка при удалении товара (код ${response.status}). ${errorData.message || ''}`
      )
    }

    products.value = products.value.filter((product) => product.id !== productId)
    alert('Товар успешно удален!')
  } catch (error) {
    console.error(error)
    alert(`Не удалось удалить товар: ${error.message}`)
  }
}

const clearProduct = (product) => {
  product.title = ''
  product.description = ''
  product.storageConditions = ''
  product.price = ''
  product.discount = ''
  product.imgUrl = ''
  product.categoryIds = []
}

const fetchProducts = async () => {
  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/foods')
    if (!response.ok) throw new Error('Ошибка при получении данных')

    const data = await response.json()

    products.value = data.map((p) => ({
      ...p,
      description: p.description || '',
      storageConditions: p.storageConditions || ''
    }))
  } catch (error) {
    console.error(error)
    alert('Не удалось получить товары')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="container mt-[-90px] mb-10 md:p-6">
    <router-link to="/adm">
      <button
        class="ml-[1210px] sm:w-auto mt-2 sm:mt-7 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 text-sm"
      >
        Вернуться
      </button>
    </router-link>
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-700">База продуктов</h1>
    <form
      @submit.prevent="addProduct"
      class="bg-white shadow-xl rounded-lg p-6 md:p-8 flex flex-col gap-5 max-w-lg mx-auto mb-10 border border-gray-200"
    >
      <h2 class="text-2xl font-semibold text-center mb-5 text-gray-600">Добавить новый товар</h2>

      <div class="flex flex-col sm:flex-row gap-3 items-start">
        <div class="flex-grow">
          <label for="new-id" class="block text-sm font-medium text-gray-700 mb-1"
            >ID Товара <span class="text-red-500">*</span></label
          >
          <input
            id="new-id"
            v-model.number="newProduct.id"
            type="number"
            placeholder="ID"
            required
            :class="[
              'border rounded-lg px-3 py-2 w-full transition-all duration-300 ease-in-out',
              inputColor
                ? `border-${inputColor}-500 ring-1 ring-${inputColor}-500`
                : 'border-gray-300',
              'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            ]"
            @input="checkId"
            @blur="checkId"
          />
          <p
            v-if="idStatusMessage"
            :class="['text-xs mt-1', idExists ? 'text-red-600' : 'text-green-600']"
          >
            {{ idStatusMessage }}
          </p>
        </div>
        <button
          type="button"
          @click="generateUniqueId"
          class="w-full sm:w-auto mt-2 sm:mt-7 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm"
        >
          Сгенерировать ID
        </button>
      </div>

      <div>
        <label for="new-title" class="block text-sm font-medium text-gray-700 mb-1"
          >Название <span class="text-red-500">*</span></label
        >
        <input
          id="new-title"
          v-model.trim="newProduct.title"
          type="text"
          placeholder="Название товара"
          required
          class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label for="new-description" class="block text-sm font-medium text-gray-700 mb-1"
          >Описание</label
        >
        <textarea
          id="new-description"
          v-model.trim="newProduct.description"
          placeholder="Описание товара (необязательно)"
          rows="3"
          class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label for="new-storage-conditions" class="block text-sm font-medium text-gray-700 mb-1"
          >Условия хранения</label
        >
        <textarea
          id="new-storage-conditions"
          v-model.trim="newProduct.storageConditions"
          placeholder="Условия хранения (напр., Хранить при t от +2 до +6 °C)"
          rows="2"
          class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-grow">
          <label for="new-price" class="block text-sm font-medium text-gray-700 mb-1"
            >Цена <span class="text-red-500">*</span></label
          >
          <input
            id="new-price"
            v-model.number="newProduct.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Цена"
            required
            class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="flex-grow">
          <label for="new-discount" class="block text-sm font-medium text-gray-700 mb-1"
            >Скидка (%)</label
          >
          <input
            id="new-discount"
            v-model.number="newProduct.discount"
            type="number"
            min="0"
            max="100"
            placeholder="Скидка"
            class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label for="new-imgUrl" class="block text-sm font-medium text-gray-700 mb-1"
          >URL изображения <span class="text-red-500">*</span></label
        >
        <input
          id="new-imgUrl"
          v-model.trim="newProduct.imgUrl"
          type="text"
          placeholder="URL изображения (напр., /food/image.jpg)"
          required
          class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
        />
        <label for="file-upload" class="text-sm font-medium text-gray-700"
          >Или загрузить файл:</label
        >
        <input
          id="file-upload"
          type="file"
          @change="handleFileUpload"
          accept="image/*"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
        />
      </div>

      <div>
        <p class="font-medium text-gray-700 mb-2 text-sm">
          Выберите категории <span class="text-red-500">*</span>:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <div v-for="category in categories" :key="category.id" class="flex items-center gap-2">
            <input
              type="checkbox"
              :id="'cat-new-' + category.id"
              :value="category.id"
              v-model="newProduct.categoryIds"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label :for="'cat-new-' + category.id" class="text-sm text-gray-700">{{
              category.name
            }}</label>
          </div>
        </div>
        <p v-if="newProduct.categoryIds.length === 0" class="text-xs text-red-600 mt-1">
          Выберите хотя бы одну категорию.
        </p>
      </div>

      <button
        type="submit"
        :disabled="idExists"
        class="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2.5 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        Добавить товар
      </button>
    </form>

    <div class="mt-12 overflow-x-auto">
      <h2 class="text-2xl font-semibold text-center mb-6 text-gray-600">Список товаров</h2>
      <table class="min-w-full w-full border border-gray-300 rounded-lg shadow-md bg-white">
        <thead class="bg-gray-100">
          <tr class="text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-4 text-left border-b">ID</th>
            <th class="py-3 px-4 text-left border-b">Название</th>
            <th class="py-3 px-4 text-left border-b">Описание</th>
            <th class="py-3 px-4 text-left border-b">Условия хранения</th>
            <th class="py-3 px-4 text-left border-b">Цена</th>
            <th class="py-3 px-4 text-left border-b">Скидка (%)</th>
            <th class="py-3 px-4 text-left border-b">Категории</th>
            <th class="py-3 px-4 text-center border-b">Действия</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm">
          <tr v-if="products.length === 0">
            <td colspan="8" class="text-center py-4 text-gray-500">Список товаров пуст.</td>
          </tr>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
          >
            <td class="py-3 px-4 whitespace-nowrap">{{ product.id }}</td>

            <td class="py-3 px-4">
              <input
                v-model.lazy="product.title"
                class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[150px]"
              />
            </td>
            <td class="py-3 px-4">
              <textarea
                v-model.lazy="product.description"
                rows="2"
                class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[200px]"
              ></textarea>
            </td>
            <td class="py-3 px-4">
              <textarea
                v-model.lazy="product.storageConditions"
                rows="2"
                class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[200px]"
              ></textarea>
            </td>

            <td class="py-3 px-4">
              <input
                v-model.number.lazy="product.price"
                type="number"
                step="0.01"
                min="0"
                class="w-24 border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </td>

            <td class="py-3 px-4">
              <input
                v-model.number.lazy="product.discount"
                type="number"
                min="0"
                max="100"
                class="w-20 border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </td>

            <td class="py-3 px-4">
              <select
                v-model="product.categoryIds"
                multiple
                class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[180px] h-20"
              >
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </td>

            <td class="py-3 px-4 text-center whitespace-nowrap">
              <div class="flex flex-col items-center justify-center gap-1.5">
                <button
                  @click="saveProduct(product)"
                  class="w-24 bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600 transition duration-200"
                >
                  Сохранить
                </button>
                <button
                  @click="clearProduct(product)"
                  class="w-24 bg-gray-400 text-white py-1 px-3 rounded text-xs hover:bg-gray-500 transition duration-200"
                >
                  Очистить
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="w-24 bg-red-600 text-white py-1 px-3 rounded text-xs hover:bg-red-700 transition duration-200"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
input:focus,
textarea:focus,
select:focus,
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-color: theme('colors.blue.500');
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

label[for='new-id']::after,
label[for='new-title']::after,
label[for='new-price']::after,
label[for='new-imgUrl']::after,
p:contains('Выберите категории')::after {
  content: ' *';
  color: theme('colors.red.500');
  margin-left: 1px;
}

.required-label::after {
  content: ' *';
  color: theme('colors.red.500');
  margin-left: 1px;
}
</style>
