    <script setup>
  import { ref } from 'vue';
  import { useSmartCart } from '../composables/useSmartCart';
  
  const messages = ref([
    { id: 1, text: 'Добро пожаловать! Напишите набор продуктов', type: 'bot' },
  ]);
  const userInput = ref('');
  const { cart } = useSmartCart();
  
  const sendMessage = async () => {
    if (!userInput.value.trim()) return;
  
    const userMessage = { id: Date.now(), text: userInput.value, type: 'user' };
    messages.value.push(userMessage);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query: userInput.value }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    const botMessage = { id: Date.now(), text: data.answer, type: 'bot' };
    messages.value.push(botMessage);
  
    if (data.products) {
      data.products.forEach(product => {
        cart.addToCart(product);
      });
    }
  
    userInput.value = '';
  };
  </script>


<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
        <p>{{ message.text }}</p>
      </div>
    </div>
    <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Ваш запрос..." />
  </div>
</template>
  
  <style scoped>
  .chat-container {
    width: 400px;
    max-height: 600px;
    border: 1px solid #ccc;
    padding: 10px;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  .message {
    margin: 5px 0;
  }
  .message.user {
    text-align: right;
    color: blue;
  }
  .message.bot {
    text-align: left;
    color: green;
  }
  input {
    padding: 5px;
  }
  </style>
  