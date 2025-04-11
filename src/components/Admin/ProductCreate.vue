   <script setup>
  import { ref, onMounted } from 'vue'
  
  const categories = [
    { id: 13077, name: 'Овощи и фрукты' },
    { id: 2, name: 'Молочные продукты' },
    { id: 3, name: 'Мясо и рыба' }
  ]
  
  
  const newProduct = ref({
    id: '',
    title: '',
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
    } catch (error) {
      console.error(error)
      inputColor.value = 'red'
      idStatusMessage.value = 'Ошибка при генерации ID'
    }
  }
  
  const checkId = async () => {
    try {
      const response = await fetch('https://f4f1d0c1ac4cb845.mokk y.dev/foods')
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
        price: parseFloat(product.price),
        discount: product.discount ? Number(product.discount) : 0,
        categoryIds: product.categoryIds.map(Number),
        imgUrl: product.imgUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при сохранении товара (код ${response.status})`);
    }

    alert("Товар успешно сохранён!");
  } catch (error) {
    console.error(error);
    alert("Не удалось сохранить товар");
  }
};


  const addProduct = async () => {
    if (!newProduct.value.id || !newProduct.value.title || !newProduct.value.price || !newProduct.value.imgUrl || !newProduct.value.categoryIds.length) {
      alert('Заполните все обязательные поля')
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
        throw new Error('Ошибка при добавлении товара')
      }
  
      products.value.push(productToAdd)
      newProduct.value = { id: '', title: '', price: '', discount: '', imgUrl: '', categoryIds: [] }
    } catch (error) {
      console.error(error)
      alert('Не удалось отправить данные')
    }
  }
  
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://f4f1d0c1ac4cb845.mokky.dev/foods/${productId}`, {
        method: 'DELETE'
      })
  
      if (!response.ok) {
        throw new Error('Ошибка при удалении товара')
      }
  
      products.value = products.value.filter(product => product.id !== productId)
    } catch (error) {
      console.error(error)
      alert('Не удалось удалить товар')
    }
  }
  
  const clearProduct = (product) => {
    product.title = ''
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
      products.value = data
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
    <div class="container mx-auto mt-24 p-6">
      <form @submit.prevent="addProduct" class="bg-white shadow-xl rounded-lg p-8 flex flex-col gap-6 max-w-md mx-auto">
        <div class="flex gap-4">
          <input 
            v-model="newProduct.id" 
            type="number" 
            placeholder="ID" 
            required 
            :class="['border rounded-lg px-4 py-3 w-full transition-all', idExists ? 'border-red-500' : 'border-green-500', 'focus:ring-2 focus:ring-blue-500']" 
            @input="checkId"  
          />
        </div>
        <p v-if="idStatusMessage" :class="idExists ? 'text-red-500' : 'text-green-500'">{{ idStatusMessage }}</p>
        <button type="button" @click="generateUniqueId" class="bg-gradient-to-r from-green-400 to-teal-500 text-white py-2 px-6 rounded-lg hover:from-green-500 hover:to-teal-600 transition-all">Сгенерировать ID</button>
        
        <!-- Название товара -->
        <input v-model="newProduct.title" type="text" placeholder="Название" required class="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500" />
  
        <!-- Цена товара (сужаем поле) -->
        <input v-model="newProduct.price" type="number" step="0.01" placeholder="Цена" required class="border rounded-lg px-4 py-3 w-32 focus:ring-2 focus:ring-blue-500" />
        
        <!-- Скидка (сужаем поле) -->
        <input v-model="newProduct.discount" type="number" placeholder="Скидка (необязательно)" class="border rounded-lg px-4 py-3 w-32 focus:ring-2 focus:ring-blue-500" />
        
        <input v-model="newProduct.imgUrl" type="text" placeholder="URL изображения" required class="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500" />
        <input type="file" @change="handleFileUpload" class="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500" />
  
        <div>
          <p class="font-semibold text-lg">Выберите категории:</p>
          <div v-for="category in categories" :key="category.id" class="flex items-center gap-3">
            <input type="checkbox" :id="'category-' + category.id" :value="category.id" v-model="newProduct.categoryIds" class="w-5 h-5" />
            <label :for="'category-' + category.id" class="text-gray-700">{{ category.name }}</label>
          </div>
        </div>
  
        <button type="submit" class="bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-green-500 hover:to-teal-600 transition-all">Добавить товар</button>
      </form>
  
      <div class="mt-8">
        <table class="table-auto w-full border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr class="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700">
              <th class="border px-6 py-3 text-left">ID</th>
              <th class="border px-6 py-3 text-left">Название</th>
              <th class="border px-6 py-3 text-left">Цена</th>
              <th class="border px-6 py-3 text-left">Скидка</th>
              <th class="border px-6 py-3 text-left">Категория</th>
              <th class="border px-6 py-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-100 transition-all">
              <td class="border px-6 py-3">{{ product.id }}</td>
              <td class="border px-6  w-full py-3">
                <input v-model="product.title" class="w-[400px] border rounded-lg px-2 py-3 " />
              </td>
              <td class="border px-6 py-3">
                <input v-model="product.price" type="number" class="w-[90px] border rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-500" />
              </td>
              <td class="border px-6 py-3">
                <input v-model="product.discount" type="number" class="w-[80px] border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              </td>
              <td class="border px-6 py-3">
                <select v-model="product.categoryIds" multiple class="w-[270px] border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500">
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }} ({{ category.id }})
                  </option>
                </select>
              </td>
              <td class="border px-3 py-3 gap-4">
                <button @click="saveProduct(product)" class="w-[120px] bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600  transition-all duration-200">Сохранить</button>
<button @click="clearProduct(product)" class="w-[120px] bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 hover:scale-102 transition-all duration-200">Очистить</button>
<button @click="deleteProduct(product.id)" class="w-[120px] bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 hover:scale-102 transition-all duration-200">Удалить</button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <style scoped>
  input[type="text"] {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  input:focus, button:hover {
    transition: all 0.3s ease-in-out;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  th {
    background-color: #f5f5f5;
    color: #333;
    text-align: left;
    padding: 16px;
  }
  
  td {
    padding: 16px;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
  
  td input {
    max-width: 1650px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  </style>
  
  