<script setup>
import { ref } from 'vue'

const chatOpen = ref(false)
const userMessage = ref('')
const chatMessages = ref([{ id: 1, from: 'support', text: 'Здравствуйте! Как я могу помочь?' }])
const showForm = ref(false)
const formData = ref({ userName: '', reason: '', userMessage: '' })
const step = ref(0)
const isLoading = ref(false)

const toggleChat = () => {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value) {
    startChat()
  }
}

const startChat = () => {
  step.value = 1
  chatMessages.value.push({ id: 2, from: 'support', text: 'Как вас зовут?' })
}

const sendMessage = async () => {
  if (userMessage.value.trim() === '') {
    alert('Сообщение не может быть пустым!')
    return
  }

  chatMessages.value.push({
    id: chatMessages.value.length + 1,
    from: 'user',
    text: userMessage.value
  })

  isLoading.value = true

  if (step.value === 1) {
    formData.value.userName = userMessage.value
    step.value = 2
    chatMessages.value.push({
      id: chatMessages.value.length + 1,
      from: 'support',
      text: 'Какая причина обращения?'
    })
  } else if (step.value === 2) {
    formData.value.reason = userMessage.value
    step.value = 3
    chatMessages.value.push({
      id: chatMessages.value.length + 1,
      from: 'support',
      text: 'Введите ваше сообщение.'
    })
  } else if (step.value === 3) {
    formData.value.userMessage = userMessage.value
    step.value = 4
    chatMessages.value.push({
      id: chatMessages.value.length + 1,
      from: 'support',
      text: 'Подготовка к отправке запроса...'
    })
    await submitForm()
  }

  userMessage.value = ''
  isLoading.value = false
}

const submitForm = async () => {
  if (!formData.value.userName || !formData.value.reason || !formData.value.userMessage) {
    alert('Пожалуйста, заполните все поля!')
    return
  }

  const formattedMessage = `
    Заявка от пользователя: ${formData.value.userName}
    Причина: ${formData.value.reason}
    Сообщение: ${formData.value.userMessage}
  `
  await sendToTelegram(formattedMessage)

  chatMessages.value.push({
    id: chatMessages.value.length + 1,
    from: 'support',
    text: 'Заявка успешно отправлена!'
  })
  formData.value = { userName: '', reason: '', userMessage: '' }
  step.value = 0
  showForm.value = false
}

const sendToTelegram = async (message) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  const params = new URLSearchParams({
    chat_id: chatId,
    text: message
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: params
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(
        `Ошибка при отправке сообщения. Код ошибки: ${response.status}. Ответ: ${JSON.stringify(data)}`
      )
    }
    console.log('Сообщение отправлено в Telegram:', data)
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error)
    alert('Ошибка при отправке сообщения в Telegram!')
  }
}
</script>

<template>
  <div class="fixed bottom-4 right-4">
    <button
      class="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition"
      @click="toggleChat"
    >
    <div class="opacity-70 hover:opacity-90">
      💬
    </div>
    </button>

    <div
      v-if="chatOpen"
      class="fixed bottom-16 right-4 w-80 bg-white shadow-xl rounded-lg p-4 border border-gray-200 transition-all ease-in-out transform"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold text-gray-700">Чат с поддержкой</h3>
        <button @click="toggleChat" class="text-gray-500 hover:text-gray-700">X</button>
      </div>
      <div class="h-48 overflow-y-auto mb-4 bg-gray-50 p-2 rounded-lg">
        <div
          v-for="message in chatMessages"
          :key="message.id"
          :class="message.from === 'user' ? 'text-right' : 'text-left'"
        >
          <p
            :class="
              message.from === 'user'
                ? ' mt-[2px] bg-green-100 text-black-400'
                : 'bg-gray-200 mb-[2px] text-gray-700'
            "
            class="inline-block rounded-lg p-2 max-w-xs"
          >
            {{ message.text }}
          </p>
        </div>
      </div>

      <div v-if="step === 1" class="flex flex-col gap-4">
        <input
          v-model="formData.userName"
          type="text"
          class="border p-2 rounded-lg text-gray-700"
          placeholder="Введите ваше имя"
        />
        <select v-model="formData.reason" class="border p-2 rounded-lg text-gray-700">
          <option value="" disabled selected>Выберите причину обращения</option>
          <option value="return">Запрос о возврате товара</option>
          <option value="order">Вопрос по заказу</option>
          <option value="feedback">Обратная связь</option>
        </select>
        <input
          v-model="formData.userMessage"
          type="text"
          class="border p-2 rounded-lg text-gray-700"
          placeholder="Введите ваше сообщение"
        />
        <button
          @click="submitForm"
          class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
        >
          Отправить
        </button>
      </div>

      <div v-else class="flex">
        <input
          v-model="userMessage"
          type="text"
          class="flex-1 border p-2 rounded-l-lg text-gray-700"
          placeholder="Напишите сообщение..."
        />
        <button
          @click="sendMessage"
          class="bg-green-500 text-white p-2 rounded-r-lg hover:bg-green-600 transition"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Отправка...' : 'Отправить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.3s;
}

.bg-green-500 {
  background-color: rgb(22, 163, 74) !important;
}

.bg-green-600 {
  background-color: rgb(16, 128, 58) !important;
}

.text-green-700 {
  color: rgb(22, 163, 74) !important;
}

.bg-green-100 {
  background-color: rgb(167, 243, 208) !important;
}
</style>
