<script setup>
import { ref } from 'vue';

const newsItems = ref([
  {
    id: 1,
    title: "Еда",
    date: "2025-05-15",
    category: "Новинки",
    categoryColor: "bg-blue-100 text-blue-800",
    excerpt: "Встречайте свежую коллекцию! Новые наборы ждут вас в нашем каталоге",
    imageUrl: "https://i.pinimg.com/736x/7a/56/b2/7a56b2ee58ce1a6558f0f68dbeccda51.jpg",
    link: "#" 
  },
  {
    id: 2,
    title: "Акция: -20% на все покупки!",
    date: "2025-05-10",
    category: "Акции",
    categoryColor: "bg-red-100 text-red-800",
    excerpt: "Готовьтесь! Только до конца мая скидка 20%.",
    imageUrl: "https://i.pinimg.com/736x/99/d2/df/99d2dfc45c8fe44940659ea834dd1be6.jpg",
    link: "#"
  },
  {
    id: 3,
    title: "Открытие Нового Пункта Выдачи в Центре Минска",
    date: "2024-05-05",
    category: "События",
    categoryColor: "bg-yellow-100 text-yellow-800",
    excerpt: "Мы стали еще ближе! Теперь вы можете забрать свой заказ в нашем новом удобном пункте выдачи по адресу ул. Независимости, 50.",
    imageUrl: "https://c4.wallpaperflare.com/wallpaper/603/312/47/minimalism-green-ice-cream-wallpaper-preview.jpg",
    link: "#"
  },
    {
    id: 4,
    title: "Советы Стилиста: Как Сочетать Яркие Аксессуары",
    date: "2024-04-28",
    category: "Статьи",
    categoryColor: "bg-purple-100 text-purple-800",
    excerpt: "Не бойтесь экспериментировать! Наш стилист делится секретами, как правильно подбирать и сочетать яркие сумки, шарфы и украшения.",
    imageUrl: "https://www.entrepreneurbusinessblog.com/wp-content/uploads/2020/01/top-10-e-commerce-tools-used-by-successful-entrepreneurs.png",
    link: "#"
  },
  {
    id: 5,
    title: "Программа Лояльности: Копите Баллы и Получайте Скидки!",
    date: "2024-04-20",
    category: "Программа лояльности",
    categoryColor: "bg-green-100 text-green-800",
    excerpt: "Присоединяйтесь к нашей программе лояльности! Получайте бонусные баллы за каждую покупку и обменивайте их на скидки.",
    imageUrl: "https://www.climaterealityproject.org/sites/default/files/bog-foodwaste-head.jpg",
    link: "#"
  },
  {
    id: 6,
    title: "График Работы в Майские Праздники",
    date: "2024-04-15",
    category: "Информация",
    categoryColor: "bg-gray-100 text-gray-800",
    excerpt: "Уважаемые покупатели, ознакомьтесь с изменениями в графике работы нашего магазина и службы доставки в период майских праздников.",
    imageUrl: "https://i.pinimg.com/736x/0f/bb/19/0fbb196980f77992734b003266d67889.jpg",
    link: "#"
  },
]);


const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  } catch (e) {
    return dateString; 
  }
};
</script>

<template>
  <div class="bg-emerald-50/50 mt-5 py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-7xl mx-auto">

      <header class="mb-10 lg:mb-14 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-emerald-700 tracking-tight flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Последние Новости
        </h2>
        <p class="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
          Будьте в курсе наших акций, новинок и событий.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <article v-for="item in newsItems" :key="item.id" class="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          <div class="flex-shrink-0">
            <a :href="item.link" class="block hover:opacity-90 transition-opacity duration-200">
              <img class="h-48 w-full object-cover" :src="item.imageUrl" :alt="item.title">
            </a>
          </div>

          <div class="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-2 text-xs text-gray-500">
                <span v-if="item.category" :class="[item.categoryColor || 'bg-gray-100 text-gray-800', 'inline-flex items-center px-2.5 py-0.5 rounded-full font-medium leading-4']">
                    {{ item.category }}
                </span>
                 <time :datetime="item.date">{{ formatDate(item.date) }}</time>
              </div>

              <a :href="item.link" class="block mt-1 group">
                <h3 class="text-lg font-semibold text-emerald-800 group-hover:text-emerald-600 transition duration-150 ease-in-out line-clamp-2" :title="item.title">
                  {{ item.title }}
                </h3>
              </a>

              <p class="mt-3 text-sm text-gray-600 line-clamp-3">
                {{ item.excerpt }}
              </p>
            </div>

            <div class="mt-4">
              <a :href="item.link" class="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 group">
                Читать далее
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-150 ease-in-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </article>
      </div>

       <div class="mt-12 text-center">
           <a href="/news" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out">
               Смотреть все новости
           </a>
       </div>

    </div>
  </div>
</template>

<style scoped>

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>