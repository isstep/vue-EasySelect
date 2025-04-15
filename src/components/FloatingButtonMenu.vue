<script setup>
import { ref, nextTick, watch } from 'vue'
import { useAuthStore } from '../stores/auth'; 
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/vue/24/solid' 
const chatOpen = ref(false)
const userMessage = ref('')
const chatMessages = ref([]) 
const formData = ref({ userIdentifier: '', reason: '', userMessage: '' }) 
const step = ref(0) 
const isLoading = ref(false)
const chatHistoryRef = ref(null) 

const authStore = useAuthStore();

const toggleChat = () => {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value && step.value === 0) { 
    startChat()
  } 
}

const startChat = () => {
  chatMessages.value = [{ id: Date.now(), from: 'support', text: 'Здравствуйте!' }]; 
  isLoading.value = false;

  if (authStore.isAuthenticated && authStore.user?.email) {
    formData.value.userIdentifier = authStore.user.email; 
    chatMessages.value.push({
      id: Date.now() + 1,
      from: 'support',
      text: `Рады видеть вас, ${authStore.user.email}! Какая причина вашего обращения?`
    });
    step.value = 2; 
  } else {
    chatMessages.value.push({
      id: Date.now() + 1,
      from: 'support',
      text: 'Пожалуйста, введите ваш email для связи.' 
    });
    step.value = 1; 
  }
  scrollToBottom();
}

const sendMessage = async () => {
  const messageText = userMessage.value.trim();
  if (messageText === '') return; 

  chatMessages.value.push({
    id: Date.now(), 
    from: 'user',
    text: messageText
  });
  userMessage.value = '';
  isLoading.value = true; 
  scrollToBottom(); 

  await nextTick(); 

  try {
    let responseMessage = '';

    if (step.value === 1) { 

      if (!/\S+@\S+\.\S+/.test(messageText)) {
         responseMessage = 'Пожалуйста, введите корректный email.';
         step.value = 1; 
      } else {
        formData.value.userIdentifier = messageText;
        responseMessage = 'Спасибо! Теперь укажите причину обращения.';
        step.value = 2; 
      }
    } else if (step.value === 2) { 
      formData.value.reason = messageText;
      responseMessage = 'Отлично. Теперь опишите ваш вопрос или проблему.';
      step.value = 3; 
    } else if (step.value === 3) {
      formData.value.userMessage = messageText;
      responseMessage = 'Спасибо! Ваш запрос обрабатывается и отправляется...';
      step.value = 4; 
      await submitForm(); 
    
    }

   
    if (step.value < 4) { 
       chatMessages.value.push({
         id: Date.now() + 1,
         from: 'support',
         text: responseMessage
       });
    }

  } catch (error) {
     console.error("Ошибка в логике sendMessage:", error);
     chatMessages.value.push({
       id: Date.now() + 1,
       from: 'support',
       text: 'Произошла внутренняя ошибка. Попробуйте позже.'
     });
     step.value = 5; 
  } finally {
    
    if (step.value !== 4) {
       isLoading.value = false;
    }
    scrollToBottom();
  }
};


const submitForm = async () => {

  if (!formData.value.userIdentifier || !formData.value.reason || !formData.value.userMessage) {
    console.error('Попытка отправки неполных данных:', formData.value);
    chatMessages.value.push({
      id: Date.now(),
      from: 'support',
      text: 'Не удалось собрать все данные для отправки. Пожалуйста, попробуйте начать чат заново.'
    });
    step.value = 5; 
    isLoading.value = false;
    scrollToBottom();
    return;
  }

  isLoading.value = true; 
  chatMessages.value.push({
      id: Date.now(),
      from: 'support',
      text: 'Отправляем ваш запрос...'
  });
  scrollToBottom();

  let userIdInfo = '';
  if (authStore.isAuthenticated && authStore.user?.id && authStore.user.id !== formData.value.userIdentifier) {
      userIdInfo = `\nUser ID: ${authStore.user.id}`;
  }

  const formattedMessage = `
    Заявка от: ${formData.value.userIdentifier}${userIdInfo}
    Причина: ${formData.value.reason}
    --------------------
    Сообщение:
    ${formData.value.userMessage}
  `;

  try {
    await sendToTelegram(formattedMessage);
    chatMessages.value.push({
      id: Date.now() + 1,
      from: 'support',
      text: 'Ваш запрос успешно отправлен! Мы скоро с вами свяжемся.'
    });
    step.value = 5; 
   
  } catch (error) {
     chatMessages.value.push({
       id: Date.now() + 1,
       from: 'support',
       text: `Произошла ошибка при отправке: ${error.message}. Попробуйте еще раз или свяжитесь с нами другим способом.`
     });
     step.value = 5; 
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

const sendToTelegram = async (message) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Конфигурация Telegram не завершена."); 
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const params = new URLSearchParams({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML' 
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: params
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Telegram API Error:', data);
      throw new Error(
        `Ошибка Telegram: ${data.description || response.status}`
      );
    }
    console.log('Сообщение отправлено в Telegram:', data);
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    throw new Error('Не удалось отправить сообщение в Telegram.');
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    const chatHistory = chatHistoryRef.value;
    if (chatHistory) {
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  });
};

watch(chatMessages, () => {
  scrollToBottom();
}, { deep: true });

</script>

<template>
  <div class="fixed bottom-5 right-5 z-[100]">
    <button
      class="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150"
      @click="toggleChat"
      aria-label="Открыть чат поддержки"
    >
      <transition
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150 transform"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
        mode="out-in"
      >
        <XMarkIcon v-if="chatOpen" class="w-7 h-7" />
        <ChatBubbleLeftRightIcon v-else class="w-7 h-7" />
      </transition>
    </button>
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div
        v-if="chatOpen"
        class="fixed bottom-20 right-5 w-[calc(100vw-40px)] max-w-sm h-[60vh] max-h-[500px] bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col overflow-hidden"
      >
        <div class="flex-shrink-0 flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
          <h3 class="text-base font-semibold text-gray-800">Чат с поддержкой</h3>
          <button @click="toggleChat" class="text-gray-400 hover:text-gray-600" aria-label="Закрыть чат">
             <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <div ref="chatHistoryRef" class="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-100/50">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            :class="['flex', message.from === 'user' ? 'justify-end' : 'justify-start']"
          >
            <p
              :class="[
                'inline-block rounded-xl py-2 px-3 max-w-[80%] break-words text-sm',
                 message.from === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none' 
              ]"
            >
              {{ message.text }}
            </p>
          </div>
           <div v-if="isLoading && step === 4" class="flex justify-start">
                <span class="inline-block bg-gray-200 text-gray-600 rounded-xl py-2 px-3 text-sm rounded-bl-none">
                    <span class="animate-pulse">Отправка...</span>
                </span>
            </div>
        </div>

        <div class="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
          <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
            <input
              v-model="userMessage"
              type="text"
              class="flex-1 border border-gray-300 p-2 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
              placeholder="Введите сообщение..."
              :disabled="isLoading || step >= 4"
              autocomplete="off"
            />
            <button
              type="submit"
              class="p-2 rounded-md text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              :class="{
                'bg-emerald-600 hover:bg-emerald-700': !isLoading && step < 4, 
                'bg-gray-400 cursor-not-allowed': isLoading || step >= 4 
              }"
              :disabled="isLoading || step >= 4"
              aria-label="Отправить сообщение"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); 
  border-radius: 3px;
}
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
</style>