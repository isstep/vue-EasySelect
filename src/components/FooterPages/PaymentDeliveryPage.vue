<script setup>
import { ref } from 'vue';

const localDeliveryCost = ref(350);
const localFreeShippingThreshold = ref(5000);
const postOfficeBaseCost = ref(300);
const codCommissionPercent = ref(2.5);

const faqItems = ref([
  {
    id: 1,
    question: 'Как изменить адрес доставки после оформления заказа?',
    answer: 'Если заказ еще не передан в службу доставки, пожалуйста, свяжитесь с нашей службой поддержки как можно скорее по телефону [Ваш Телефон] или email [Ваш Email]. Мы постараемся внести изменения. Если заказ уже в пути, изменение адреса может быть невозможно или потребует дополнительной оплаты.',
    open: false
  },
  {
    id: 2,
    question: 'Что делать, если я пропустил(а) курьера?',
    answer: 'Курьер обычно пытается связаться с вами перед доставкой. Если доставка не удалась, курьерская служба предпримет еще одну попытку (обычно на следующий день) или оставит заказ в ближайшем пункте выдачи/постамате (если применимо). Вы также получите уведомление с инструкциями. Вы всегда можете связаться с нами или напрямую со службой доставки для уточнения деталей.',
    open: false
  },
  {
    id: 3,
    question: 'Насколько безопасна оплата картой на вашем сайте?',
    answer: 'Абсолютно безопасна. Все платежи обрабатываются через сертифицированный платежный шлюз [Название Платежного Шлюза], который соответствует стандарту безопасности PCI DSS. Мы используем шифрование SSL для защиты всех передаваемых данных и не храним данные вашей карты на наших серверах.',
    open: false
  },
  {
    id: 4,
    question: 'Когда я получу возврат средств при отмене заказа или возврате товара?',
    answer: 'Возврат средств производится тем же способом, которым была произведена оплата. После получения и проверки возвращенного товара (или подтверждения отмены заказа до отправки), мы инициируем возврат в течение 1-3 рабочих дней. Срок зачисления средств на ваш счет зависит от вашего банка и может составлять от 3 до 30 дней.',
    open: false
  },
  {
    id: 5,
    question: 'Могу ли я оплатить заказ картой, выпущенной не в Беларуси?',
    answer: 'Да, мы принимаем к оплате карты Visa и Mastercard, выпущенные банками других стран. Однако, в некоторых случаях могут возникнуть ограничения со стороны банка-эмитента или платежной системы. Если у вас возникли трудности с оплатой, попробуйте другой способ или свяжитесь с нами.',
    open: false
  },
  {
    id: 6,
    question: 'Что входит в стоимость доставки?',
    answer: 'Стоимость доставки включает упаковку товара, услуги транспортной компании по перевозке и, в случае курьерской доставки, доставку до указанного вами адреса. Таможенные пошлины и налоги (для международных отправлений) не включены в стоимость доставки и оплачиваются получателем отдельно.',
    open: false
  }
]);

const toggleFaq = (id) => {
  const item = faqItems.value.find(i => i.id === id);
  if (item) {
    item.open = !item.open;
  }
};


const deliveryRegions = ref([
  { name: 'Минск', time: '1-2 дня', courier: true, pickup: true, post: true },

]);

const paymentMethods = ref([
  { id: 'card', name: 'Банковская карта (Онлайн)', icon: 'credit-card', available: true, description: 'Visa, Mastercard, МИР через защищенный шлюз.' },
  { id: 'sbp', name: 'Система Быстрых Платежей', icon: 'qr-code', available: true, description: 'Оплата по QR-коду или номеру телефона.' },
  { id: 'ewallet', name: 'Электронный кошелек', icon: 'wallet', available: true, description: 'ЮMoney, QIWI (если поддерживается).' },
  { id: 'cod', name: 'Оплата при получении', icon: 'cash', available: true, description: `Наличными или картой курьеру/в ПВЗ. Возможна комиссия ${codCommissionPercent.value}%.` },
  { id: 'transfer', name: 'Банковский перевод', icon: 'bank', available: true, description: 'Для юридических и физических лиц. Счет высылается после заказа.' },
]);

</script>

<template>
  <div class=" p-6 sm:p-8 lg:p-12 rounded-lg max-w-6xl mx-auto my-8 font-sans antialiased">
    <h1 class="text-4xl font-bold text-emerald-800 mb-10 text-center tracking-tight">
      Доставка и Оплата Ваших Заказов
    </h1>

    <section class="mb-12 lg:mb-16">
      <h2 class="flex items-center text-3xl font-semibold text-emerald-700 mb-6 border-b-2 border-emerald-200 pb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m10-6v7a1 1 0 01-1 1h-1m-6 0h6M9 9h6v5m-7 1h7" />
        </svg>
        Информация о Доставке
      </h2>
      <div class="space-y-8 text-gray-700 text-base leading-relaxed">

        <p class="text-lg text-gray-800">Мы стремимся доставить ваши покупки максимально быстро и бережно. Ниже вы найдете подробную информацию о доступных способах, сроках и стоимости доставки.</p>

        <div class="p-5 bg-emerald-50 rounded-md border border-emerald-100">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Способы доставки по Минску:</h3>
          <div class="space-y-5">

        
            <div class="flex items-start space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h4 class="font-medium text-gray-900">Курьерская доставка по Области</h4>
                <p>Доставка "до двери" в пределах города и ближайших пригородов. Идеально для быстрой и удобной доставки.</p>
                <ul class="list-disc list-inside pl-2 text-sm text-gray-600 mt-2 space-y-1">
                  <li>Срок: Обычно <span class="font-medium">1-2 рабочих дня</span> (при заказе до 13:00).</li>
                  <li>Стоимость: <span class="font-medium">{{ localDeliveryCost }} ₽</span>.</li>
                  <li><span class="font-medium text-emerald-600">Бесплатно</span> при сумме заказа от <span class="font-medium">{{ localFreeShippingThreshold }} ₽</span>.</li>
                  <li>Возможность выбора удобного интервала доставки (уточняется при подтверждении заказа).</li>
                </ul>
              </div>
            </div>

            


        
             <div class="flex items-start space-x-4">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" clip-rule="evenodd" />
               </svg>
               <div>
                 <h4 class="font-medium text-gray-900">Доставка через курьера</h4>
                 <p>Доставка курьером. Подходит для отдаленных населенных пунктов, куда не доставляют ТК.</p>
                  <ul class="list-disc list-inside pl-2 text-sm text-gray-600 mt-2 space-y-1">
                    <li>Срок: <span class="font-medium">До 5 часов</span> в зависимости от региона.</li>
                    <li>Стоимость: Рассчитывается при оформлении заказа. Ориентировочно от {{ postOfficeBaseCost }} ₽.</li>
                    <li>Доставка только определённых районов</li>
                    <li>Предоставляется <span class="font-medium">трек-номер</span> для отслеживания.</li>
                    <li>Возможны ограничения по весу и габаритам для некоторых отправлений.</li>
                 </ul>
               </div>
             </div>

        
            <div class="flex items-start space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
               <div>
                 <h4 class="font-medium text-gray-900">Самовывоз из нашего магазина/склада</h4>
                 <p>Заберите свой заказ самостоятельно в удобное для вас время.</p>
                  <ul class="list-disc list-inside pl-2 text-sm text-gray-600 mt-2 space-y-1">
                    <li>Адрес: <span class="font-medium">[Полный Адрес Пункта Самовывоза, включая город]</span>.</li>
                    <li>График работы: <span class="font-medium">[Дни недели и часы работы пункта самовывоза]</span>.</li>
                    <li>Стоимость: <span class="font-medium text-emerald-600">Бесплатно</span>.</li>
                    <li>Готовность заказа: Обычно <span class="font-medium">в течение 1 рабочего дня</span>. Вы получите SMS или email уведомление о готовности.</li>
                 </ul>
               </div>
             </div>
          </div>
        </div>


        <div class="p-5 bg-gray-50 rounded-md border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Международная доставка (Уточняйте возможность):</h3>
           <div class="flex items-start space-x-4">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 4.5v6m0 0l-4-4m4 4l4-4M12 18.5v-3" />
             </svg>
              <div>
                <h4 class="font-medium text-gray-900">Отправка за пределы Беларуси</h4>
                <p>Мы можем организовать доставку в некоторые страны [Список Стран, например, СНГ, Европы]. Пожалуйста, свяжитесь с нами для уточнения возможности, сроков и стоимости перед оформлением заказа.</p>
                 <ul class="list-disc list-inside pl-2 text-sm text-gray-600 mt-2 space-y-1">
                    <li>Перевозчики: EMS, DHL (международные отправления).</li>
                    <li>Стоимость и сроки: Рассчитываются <span class="font-medium">индивидуально</span>.</li>
                    <li><span class="font-medium text-red-600">Важно:</span> Таможенные пошлины и налоги страны назначения <span class="font-medium">не включены</span> в стоимость и оплачиваются получателем согласно законодательству его страны.</li>
                    <li>Оплата международных заказов обычно производится только онлайн (картой).</li>
                 </ul>
              </div>
           </div>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 border rounded-md">
            <h4 class="font-semibold text-lg text-gray-800 mb-2">Обработка и Сборка Заказа</h4>
            <p>Стандартное время комплектации и подготовки вашего заказа к отгрузке составляет <span class="font-medium">2-3 часа</span> после подтверждения оплаты (или подтверждения заказа при оплате при получении). В периоды высокой загрузки (праздники, распродажи) срок может незначительно увеличиться.</p>
          </div>
          <div class="p-4 border rounded-md">
            <h4 class="font-semibold text-lg text-gray-800 mb-2">Отслеживание Заказа</h4>
            <p>После того как ваш заказ будет передан в службу доставки, мы отправим вам <span class="font-medium">уведомление</span> на указанный email или номер телефона. В уведомлении будет содержаться <span class="font-medium">трек-номер</span> и ссылка для отслеживания на сайте транспортной компании.</p>
          </div>
          <div class="p-4 border rounded-md">
             <h4 class="font-semibold text-lg text-gray-800 mb-2">Упаковка</h4>
             <p>Мы тщательно упаковываем все заказы, используя прочные коробки и амортизирующие материалы, чтобы гарантировать сохранность товаров во время транспортировки.</p>
          </div>
           <div class="p-4 border rounded-md bg-yellow-50 border-yellow-200">
             <h4 class="font-semibold text-lg text-yellow-800 mb-2">Важно при Получении</h4>
             <p>При получении заказа, пожалуйста, внимательно осмотрите упаковку на предмет повреждений. Если упаковка нарушена, составьте акт с представителем службы доставки. Проверьте комплектность заказа в присутствии курьера или в пункте выдачи.</p>
          </div>
        </div>

        <div>
          <h4 class="text-xl font-semibold text-emerald-600 mb-4">Ориентировочные сроки доставки по регионам:</h4>
          <div class="overflow-x-auto rounded-md border">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Регион</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Примерный Срок</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Доступные Способы</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="region in deliveryRegions" :key="region.name" class="hover:bg-emerald-50 transition duration-150 ease-in-out">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ region.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ region.time }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span v-if="region.courier" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">Курьер/ТК</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-gray-500 mt-2">* Указаные сроки являются ориентировочными. Точные сроки рассчитываются при оформлении заказа.</p>
        </div>

      </div>
    </section>


    <section class="mb-12 lg:mb-16">
       <h2 class="flex items-center text-3xl font-semibold text-emerald-700 mb-6 border-b-2 border-emerald-200 pb-3">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        Способы Оплаты
      </h2>
       <div class="space-y-8 text-gray-700 text-base leading-relaxed">
         <p class="text-lg text-gray-800">Выберите наиболее удобный и безопасный способ оплаты вашего заказа. Мы предлагаем несколько вариантов для вашего комфорта.</p>

         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


          <div v-for="method in paymentMethods.filter(m => ['card', 'sbp', 'ewallet'].includes(m.id) && m.available)" :key="method.id" class="p-5 border rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col">
            <div class="flex items-center mb-3">

              <svg v-if="method.icon === 'credit-card'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <svg v-if="method.icon === 'qr-code'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6.5 6.5v2m-4.5-12.5H6M6 6h.01M6 12h.01M6 18h.01M12 6h.01M12 18h.01M18 6h.01M18 12h.01M18 18h.01M8.464 8.464l.707.707M8.464 15.536l.707-.707M15.536 8.464l-.707.707M15.536 15.536l-.707-.707M3 10h3v3H3zM18 10h3v3h-3zM10 3h3v3h-3zM10 18h3v3h-3z"/></svg>
              <svg v-if="method.icon === 'wallet'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3m-3 0l-3-9m3 9l3-9M15 7l6-2" /></svg>
               <h4 class="font-semibold text-lg text-gray-900">{{ method.name }}</h4>
            </div>
             <p class="text-sm text-gray-600 flex-grow">{{ method.description }}</p>
              <span class="mt-3 text-xs font-medium text-emerald-600 block">Быстро и безопасно</span>
          </div>

    
           <div v-if="paymentMethods.find(m => m.id === 'cod' && m.available)" class="p-5 border rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col bg-blue-50 border-blue-100">
             <div class="flex items-center mb-3">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
               <h4 class="font-semibold text-lg text-gray-900">{{ paymentMethods.find(m => m.id === 'cod').name }}</h4>
            </div>
             <p class="text-sm text-gray-600 flex-grow">{{ paymentMethods.find(m => m.id === 'cod').description }}</p>
              <span class="mt-3 text-xs font-medium text-blue-600 block">Оплата после осмотра</span>
             <p class="text-xs text-gray-500 mt-1">Доступно не для всех способов доставки и регионов. Уточняйте при оформлении.</p>
          </div>

           <div v-if="paymentMethods.find(m => m.id === 'transfer' && m.available)" class="p-5 border rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col">
             <div class="flex items-center mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm-5-14v2m8-2v2m-4 0h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <h4 class="font-semibold text-lg text-gray-900">{{ paymentMethods.find(m => m.id === 'transfer').name }}</h4>
            </div>
             <p class="text-sm text-gray-600 flex-grow">{{ paymentMethods.find(m => m.id === 'transfer').description }}</p>
              <span class="mt-3 text-xs font-medium text-emerald-600 block">Для юр. лиц и физ. лиц</span>
             <p class="text-xs text-gray-500 mt-1">Срок зачисления: 1-3 банковских дня. Заказ будет отправлен после поступления средств.</p>
          </div>

         </div>

         <div class="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-4">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
           <div>
             <h4 class="font-semibold text-lg text-emerald-800 mb-1">Безопасность платежей</h4>
             <p class="text-emerald-700 text-sm">Мы гарантируем безопасность ваших онлайн-платежей. Все транзакции проходят через защищенное <span class="font-medium">SSL-соединение</span> и обрабатываются сертифицированным платежным шлюзом <span class="font-medium">[Название Платежного Шлюза]</span>. Данные ваших карт <span class="font-medium">не сохраняются</span> на нашем сервере.</p>
           </div>
         </div>
       </div>
    </section>

     <section class="mb-12 lg:mb-16">
        <h2 class="flex items-center text-3xl font-semibold text-emerald-700 mb-6 border-b-2 border-emerald-200 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Часто Задаваемые Вопросы
        </h2>
        <div class="space-y-4">
            <div v-for="item in faqItems" :key="item.id" class="border border-gray-200 rounded-md overflow-hidden">
                <button @click="toggleFaq(item.id)" class="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50 transition duration-150 ease-in-out">
                    <span class="text-base font-medium text-gray-800">{{ item.question }}</span>
                     <svg :class="{'transform rotate-180': item.open}" class="h-5 w-5 text-gray-500 transition-transform duration-200 ease-in-out" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                     </svg>
                </button>
                <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 -translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1"
                >
                  <div v-show="item.open" class="p-4 text-sm text-gray-600 bg-white border-t border-gray-200 leading-relaxed">
                      {{ item.answer }}
                  </div>
               </transition>
            </div>
        </div>
     </section>

    <section>
       <h2 class="flex items-center text-3xl font-semibold text-emerald-700 mb-6 border-b-2 border-emerald-200 pb-3">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
         </svg>
         Остались Вопросы?
      </h2>
      <div class="bg-emerald-50 p-6 rounded-lg border border-emerald-100 text-center">
         <p class="text-lg text-gray-800 mb-4">Если вы не нашли ответ на свой вопрос о доставке или оплате, наша служба поддержки всегда готова помочь!</p>
         <div class="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
             <a href="tel:[-]" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                 </svg>
                 Позвонить: [+3752512345678]
             </a>
             <a href="mailto:[- ]" class="inline-flex items-center px-4 py-2 border border-emerald-300 text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                 </svg>
                 Написать: [EasySelect@gmail.com]
             </a>
         </div>
          <p class="text-sm text-gray-500 mt-4">Часы работы службы поддержки: [Пн-Пт с 9:00 до 21:00 МСК]</p>
      </div>
    </section>

  </div>
</template>

<style scoped>

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>