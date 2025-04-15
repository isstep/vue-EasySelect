<script setup>
import { ref } from 'vue';


const address = ref({
  street: "просп. Пушкина, д. 100",
  city: "Минск",
  postalCode: "220020",
  country: "Беларусь",
  full: "просп. Пушкина, д. 100, г. Минск, 220020, Беларусь"
});




const email = ref("EasySelect@gmail.com"); 

const socialLinks = ref([
    { name: 'VK', url: '#', icon: 'vk-icon-placeholder' }, 
    { name: 'Instagram', url: '#', icon: 'instagram-icon-placeholder' },
    { name: 'Telegram', url: '#', icon: 'telegram-icon-placeholder' }
]);

const operatingHours = ref([
  { day: 'Понедельник - Пятница', time: '09:00 - 19:00' },
  { day: 'Суббота', time: '10:00 - 17:00' },
  { day: 'Воскресенье', time: 'Выходной' },
]);

const contactForm = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreedToPolicy: false
});

const formSubmitted = ref(false);
const formError = ref(null);

const submitForm = async () => {
    formError.value = null;
    formSubmitted.value = false;

    if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message || !contactForm.value.agreedToPolicy) {
        formError.value = 'Пожалуйста, заполните все обязательные поля и согласитесь с политикой обработки данных.';
        return;
    }
    if (!/\S+@\S+\.\S+/.test(contactForm.value.email)) {
         formError.value = 'Пожалуйста, введите корректный email адрес.';
        return;
    }

    console.log("Отправка формы:", contactForm.value);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Результат
    formSubmitted.value = true;
};

</script>

<template>
  <div class="mt-4 py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-7xl mx-auto bg-white p-6 sm:p-10 ">

      <header class="mb-10 text-center">
        <h1 class="text-4xl lg:text-5xl font-bold text-emerald-700 tracking-tight">
          Наши Контакты в Минске
        </h1>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Мы всегда рады помочь вам! Свяжитесь с нами любым удобным способом.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

        <div class="lg:col-span-1 space-y-8">

          <section>
            <h2 class="flex items-center text-2xl font-semibold text-emerald-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Наш Адрес
            </h2>
            <address class="not-italic text-gray-700 space-y-1 text-base leading-relaxed">
              <p>{{ address.street }}</p>
              <p>{{ address.city }}, {{ address.postalCode }}</p>
              <p>{{ address.country }}</p>
            </address>
             <a href="https://yandex.by/maps/?text=Минск, проспект Победителей 100" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                Показать на карте (Яндекс)
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
             </a>
          </section>

          <section>
            <h2 class="flex items-center text-2xl font-semibold text-emerald-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Телефоны

            </h2>
            <div class="space-y-2 text-base text-gray-700">
                 <span class="font-medium text-emerald-700">  +3752512345678</span>
                 <a class="ml-2 text-emerald-700 hover:text-emerald-900 hover:underline">
  
                 </a>
            </div>
          </section>

          <section>
            <h2 class="flex items-center text-2xl font-semibold text-emerald-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Электронная почта
            </h2>
            <a :href="'mailto:' + email" class="text-base text-emerald-700 hover:text-emerald-900 hover:underline break-all">
                {{ email }}
            </a>
             <p class="text-sm text-gray-500 mt-1">Отвечаем в течение 1 рабочего дня.</p>
          </section>

          <section>
            <h2 class="flex items-center text-2xl font-semibold text-emerald-600 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Часы работы
            </h2>
            <div class="space-y-2 text-base text-gray-700">
                <div v-for="item in operatingHours" :key="item.day" class="flex justify-between">
                    <span class="font-medium text-gray-800">{{ item.day }}:</span>
                    <span :class="{'text-red-600 font-medium': item.time === 'Выходной'}">
                        {{ item.time }}
                    </span>
                </div>
            </div>
          </section>

          <section>
            <h2 class="flex items-center text-2xl font-semibold text-emerald-600 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Мы в соцсетях
            </h2>
            <div class="flex space-x-4">
                <a v-for="link in socialLinks" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-emerald-600 transition duration-150 ease-in-out" :aria-label="link.name">
                    <span class="inline-block w-6 h-6 bg-gray-300 rounded-full text-center leading-6 text-xs">
                        {{ link.name.substring(0,2) }}
                    </span>
                </a>
            </div>
          </section>

        </div>

        <div class="lg:col-span-2 space-y-10">

           <section>
             <h2 class="text-2xl font-semibold text-emerald-600 mb-4">Как нас найти</h2>
             <div class="rounded-lg overflow-hidden shadow">
               <iframe
                 src="https://yandex.ru/map-widget/v1/?um=constructor%3A7b836870288b0a996897b634272060370b2f265a46ea3a7ab870522b64b51944&source=constructor"
                 width="100%"
                 height="400"
                 frameborder="0"
                 allowfullscreen="true"
                 style="position: relative; display: block;"
                 title="Карта проезда">
               </iframe>
    
             </div>
             <p class="mt-4 text-gray-600 text-sm">
                 Мы находимся в в Минске. просп. Пушкина, д. 100
             </p>
           </section>

            <section>
                <h2 class="text-2xl font-semibold text-emerald-600 mb-5">Напишите нам</h2>

                <form @submit.prevent="submitForm" class="space-y-5">
                    <div>
                        <label for="contact-name" class="block text-sm font-medium text-gray-700 mb-1">Ваше имя <span class="text-red-500">*</span></label>
                        <input type="text" id="contact-name" v-model="contactForm.name" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Иван Петров">
                    </div>

                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="contact-email" class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                            <input type="email" id="contact-email" v-model="contactForm.email" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="you@example.com">
                        </div>
                         <div>
                            <label for="contact-phone" class="block text-sm font-medium text-gray-700 mb-1">Телефон (необязательно)</label>
                            <input type="tel" id="contact-phone" v-model="contactForm.phone" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="+375 (XX) XXX-XX-XX">
                        </div>
                     </div>

                     <div>
                        <label for="contact-subject" class="block text-sm font-medium text-gray-700 mb-1">Тема сообщения</label>
                        <input type="text" id="contact-subject" v-model="contactForm.subject" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Вопрос по заказу №123">
                    </div>

                    <div>
                        <label for="contact-message" class="block text-sm font-medium text-gray-700 mb-1">Сообщение <span class="text-red-500">*</span></label>
                        <textarea id="contact-message" v-model="contactForm.message" rows="5" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Опишите ваш вопрос или предложение..."></textarea>
                    </div>

                    <div class="flex items-start">
                         <div class="flex items-center h-5">
                            <input id="contact-policy" v-model="contactForm.agreedToPolicy" type="checkbox" required class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded">
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="contact-policy" class="font-medium text-gray-700">Я согласен(на) с <a href="/privacy-policy" target="_blank" class="text-emerald-600 hover:underline">политикой обработки персональных данных</a> <span class="text-red-500">*</span></label>
                        </div>
                    </div>

                    <div v-if="formError" class="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                        {{ formError }}
                    </div>
                     <div v-if="formSubmitted" class="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
                        Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.
                    </div>

                    <div>
                         <button type="submit" class="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out">
                            Отправить сообщение
                        </button>
                    </div>
                </form>
            </section>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.aspect-w-16 { position: relative; padding-bottom: 56.25%; } 
.aspect-h-9  
.aspect-w-16 > iframe,
.aspect-w-16 > div { 
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.vk-icon-placeholder,
.instagram-icon-placeholder,
.telegram-icon-placeholder {
    display: inline-block;
    width: 1.5rem; 
    height: 1.5rem; 
    background-color: #e5e7eb;
    border-radius: 9999px; 
    line-height: 1.5rem;
    text-align: center;
    font-size: 0.75rem; 
    font-weight: 500;
    color: #4b5563;
}
</style>