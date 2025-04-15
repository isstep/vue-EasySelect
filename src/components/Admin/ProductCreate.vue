<script setup>
import { ref, onMounted } from 'vue'

const categories = [
  { id: 13077, name: 'Овощи и фрукты' },
  { id: 2, name: 'Молочные продукты' },
  { id: 7544, name: 'Мясо и рыба' },
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
    } while (existingProducts.some(product => product.id === newId))

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
     idStatusMessage.value = '';
     inputColor.value = '';
     idExists.value = false;
     return;
  }
  try {
    const response = await fetch('https://f4f1d0c1ac4cb845.mokky.dev/foods')
    if (!response.ok) throw new Error('Ошибка при получении данных')

    const existingProducts = await response.json()
    idExists.value = existingProducts.some(product => product.id === Number(newProduct.value.id))

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
  const productId = Number(product.id);
  if (!productId) {
    console.error("Некорректный ID:", product.id);
    alert("Ошибка: некорректный ID товара.");
    return;
  }

  try {
    const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: product.title,
        description: product.description,
        storageConditions: product.storageConditions, 
        price: parseFloat(product.price),
        discount: product.discount ? Number(product.discount) : 0,
        categoryIds: product.categoryIds.map(Number),
        imgUrl: product.imgUrl,
      }),
    });

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: 'Не удалось получить детали ошибки' }));
       console.error('Ошибка от сервера:', errorData);
       throw new Error(`Ошибка при сохранении товара (код ${response.status}). ${errorData.message || ''}`);
    }

    alert("Товар успешно сохранён!");
    const index = products.value.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.value[index] = {
            ...products.value[index],
             title: product.title,
             description: product.description,
             storageConditions: product.storageConditions, 
             price: parseFloat(product.price),
             discount: product.discount ? Number(product.discount) : 0,
             categoryIds: product.categoryIds.map(Number),
             imgUrl: product.imgUrl,
        };
    }

  } catch (error) {
    console.error(error);
    alert(`Не удалось сохранить товар: ${error.message}`);
  }
};

const addProduct = async () => {
  if (!newProduct.value.id || !newProduct.value.title || !newProduct.value.price || !newProduct.value.imgUrl || !newProduct.value.categoryIds.length) {
    alert('Заполните все обязательные поля (ID, Название, Цена, URL изображения, Категории)')
    return
  }

  await checkId();
  if (idExists.value) {
      alert('Выбранный ID уже занят. Сгенерируйте новый или введите другой.');
      return;
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
       const errorData = await response.json().catch(() => ({ message: 'Не удалось получить детали ошибки' }));
       console.error('Ошибка от сервера:', errorData);
       throw new Error(`Ошибка при добавлении товара (код ${response.status}). ${errorData.message || ''}`);
    }

    const addedProduct = await response.json();

    products.value.push({
        ...addedProduct,
        description: addedProduct.description || '',
        storageConditions: addedProduct.storageConditions || '' 
    });


    newProduct.value = { id: '', title: '', description: '', storageConditions: '', price: '', discount: '', imgUrl: '', categoryIds: [] } 
    idStatusMessage.value = '';
    inputColor.value = '';
    alert('Товар успешно добавлен!');

  } catch (error) {
    console.error(error)
    alert(`Не удалось отправить данные: ${error.message}`)
  }
}

const deleteProduct = async (productId) => {
  if (!confirm(`Вы уверены, что хотите удалить товар с ID ${productId}?`)) {
      return;
  }

  try {
    const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${productId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: 'Не удалось получить детали ошибки' }));
       console.error('Ошибка от сервера:', errorData);
       throw new Error(`Ошибка при удалении товара (код ${response.status}). ${errorData.message || ''}`);
    }

    products.value = products.value.filter(product => product.id !== productId)
    alert('Товар успешно удален!');
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

    products.value = data.map(p => ({
        ...p,
        description: p.description || '',
        storageConditions: p.storageConditions || '' 
    }));
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
  <div class="container mx-auto mt-10 mb-10 p-4 md:p-6">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-700">Управление товарами</h1>

    <form @submit.prevent="addProduct" class="bg-white shadow-xl rounded-lg p-6 md:p-8 flex flex-col gap-5 max-w-lg mx-auto mb-10 border border-gray-200">
      <h2 class="text-2xl font-semibold text-center mb-5 text-gray-600">Добавить новый товар</h2>

      <div class="flex flex-col sm:flex-row gap-3 items-start">
         <div class="flex-grow">
           <label for="new-id" class="block text-sm font-medium text-gray-700 mb-1">ID Товара <span class="text-red-500">*</span></label>
           <input
             id="new-id"
             v-model.number="newProduct.id"
             type="number"
             placeholder="ID"
             required
             :class="['border rounded-lg px-3 py-2 w-full transition-all duration-300 ease-in-out', inputColor ? `border-${inputColor}-500 ring-1 ring-${inputColor}-500` : 'border-gray-300', 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500']"
             @input="checkId"
             @blur="checkId"
           />
           <p v-if="idStatusMessage" :class="['text-xs mt-1', idExists ? 'text-red-600' : 'text-green-600']">{{ idStatusMessage }}</p>
         </div>
         <button type="button" @click="generateUniqueId" class="w-full sm:w-auto mt-2 sm:mt-7 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm">
           Сгенерировать ID
         </button>
       </div>

      <div>
        <label for="new-title" class="block text-sm font-medium text-gray-700 mb-1">Название <span class="text-red-500">*</span></label>
        <input id="new-title" v-model.trim="newProduct.title" type="text" placeholder="Название товара" required class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div>
        <label for="new-description" class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea
          id="new-description"
          v-model.trim="newProduct.description"
          placeholder="Описание товара (необязательно)"
          rows="3"
          class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label for="new-storage-conditions" class="block text-sm font-medium text-gray-700 mb-1">Условия хранения</label>
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
          <label for="new-price" class="block text-sm font-medium text-gray-700 mb-1">Цена <span class="text-red-500">*</span></label>
          <input id="new-price" v-model.number="newProduct.price" type="number" step="0.01" min="0" placeholder="Цена" required class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="flex-grow">
          <label for="new-discount" class="block text-sm font-medium text-gray-700 mb-1">Скидка (%)</label>
          <input id="new-discount" v-model.number="newProduct.discount" type="number" min="0" max="100" placeholder="Скидка" class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>


      <div>
         <label for="new-imgUrl" class="block text-sm font-medium text-gray-700 mb-1">URL изображения <span class="text-red-500">*</span></label>
         <input id="new-imgUrl" v-model.trim="newProduct.imgUrl" type="text" placeholder="URL изображения (напр., /food/image.jpg)" required class="border rounded-lg px-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2" />
         <label for="file-upload" class="text-sm font-medium text-gray-700">Или загрузить файл:</label>
         <input id="file-upload" type="file" @change="handleFileUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1" />
      </div>


      <div>
        <p class="font-medium text-gray-700 mb-2 text-sm">Выберите категории <span class="text-red-500">*</span>:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <div v-for="category in categories" :key="category.id" class="flex items-center gap-2">
            <input type="checkbox" :id="'cat-new-' + category.id" :value="category.id" v-model="newProduct.categoryIds" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            <label :for="'cat-new-' + category.id" class="text-sm text-gray-700">{{ category.name }}</label>
          </div>
        </div>
         <p v-if="newProduct.categoryIds.length === 0" class="text-xs text-red-600 mt-1">Выберите хотя бы одну категорию.</p>
      </div>

  
      <button type="submit" :disabled="idExists" class="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2.5 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
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
          <tr v-for="product in products" :key="product.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
          
            <td class="py-3 px-4 whitespace-nowrap">{{ product.id }}</td>
           
            <td class="py-3 px-4">
              <input v-model.lazy="product.title" class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[150px]" />
            </td>
            <td class="py-3 px-4">
              <textarea v-model.lazy="product.description" rows="2" class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[200px]"></textarea>
            </td>
            <td class="py-3 px-4">
              <textarea v-model.lazy="product.storageConditions" rows="2" class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[200px]"></textarea>
            </td>
     
            <td class="py-3 px-4">
              <input v-model.number.lazy="product.price" type="number" step="0.01" min="0" class="w-24 border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400" />
            </td>
       
            <td class="py-3 px-4">
              <input v-model.number.lazy="product.discount" type="number" min="0" max="100" class="w-20 border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400" />
            </td>
        
            <td class="py-3 px-4">
              <select v-model="product.categoryIds" multiple class="w-full border rounded px-2 py-1 border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-w-[180px] h-20">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </td>
    
            <td class="py-3 px-4 text-center whitespace-nowrap">
              <div class="flex flex-col items-center justify-center gap-1.5">
                 <button @click="saveProduct(product)" class="w-24 bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600 transition duration-200">Сохранить</button>
                 <button @click="clearProduct(product)" class="w-24 bg-gray-400 text-white py-1 px-3 rounded text-xs hover:bg-gray-500 transition duration-200">Очистить</button>
                 <button @click="deleteProduct(product.id)" class="w-24 bg-red-600 text-white py-1 px-3 rounded text-xs hover:bg-red-700 transition duration-200">Удалить</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

input:focus, textarea:focus, select:focus, button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-color: theme('colors.blue.500');
    box-shadow: 0 0 0 2px var(--tw-ring-color);
}

label[for="new-id"]::after,
label[for="new-title"]::after,
label[for="new-price"]::after,
label[for="new-imgUrl"]::after,
p:contains("Выберите категории")::after {
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