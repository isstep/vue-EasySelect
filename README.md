# [CosmoExpress](https://vue-cosmo-express.vercel.app)

**CosmoExpress** — это веб-приложение, позволяющее пользователям просматривать и сортировать различные виды еды, а также отмечать их как избранные. Проект построен на основе фреймворка **Vue.js** и включает основные функции для взаимодействия с пользователями.

---

## 🚀 Используемые технологии

### 🧩 **Vue.js**
Основной фреймворк для разработки пользовательского интерфейса.  
![Vue.js Logo](https://vuejs.org/images/logo.png)

### 🎨 **Tailwind CSS**
Утилитарный CSS-фреймворк для стилизации интерфейса.  
![Tailwind CSS Logo](https://tailwindcss.com/_next/static/media/logo-dark.35a26032.svg)

### 🌐 **Axios**
Библиотека для выполнения HTTP-запросов.  
![Axios Logo](https://axios-http.com/assets/logo.svg)

### ⚡ **Vite**
Быстрый и легковесный инструмент для разработки, использующий нативные ES-модули.  
![Vite Logo](https://vitejs.dev/logo.svg)

### 🎠 **Vue3 Carousel**
Компонент для создания карусели в Vue 3.  
![Vue3 Carousel Logo](https://cdn.jsdelivr.net/npm/vue3-carousel@0.10.0/dist/vue3-carousel.min.js)

### ✨ **autoAnimatePlugin**
Библиотека для создания автоанимаций.  
![autoAnimatePlugin Logo](https://www.auto-animate.com/assets/img/logo.svg)

### 🗺️ **Vue Router**
Официальный маршрутизатор для Vue.js, позволяющий легко управлять навигацией между компонентами и страницами.  
![Vue Router Logo](https://router.vuejs.org/logo.png)

---

## 📦 Основные компоненты

### 🏷️ **HeaderMain**
Компонент для отображения основного заголовка и навигации.  
![HeaderMain Icon](https://img.icons8.com/ios-filled/50/000000/header.png)

### 🗂️ **CardList**
Компонент для отображения списка продуктов с возможностью сортировки.  
![CardList Icon](https://img.icons8.com/ios-filled/50/000000/list.png)

### 🖼️ **DrawerComponent** (Закомментирован)
Компонент для боковой панели, которая может использоваться для дополнительной навигации или фильтров.  
![DrawerComponent Icon](https://img.icons8.com/ios-filled/50/000000/sidebar.png)

### 🎠 **Carouse**
Карусель для отображения промо-контента или избранных продуктов.  
![Carouse Icon](https://img.icons8.com/ios-filled/50/000000/carousel.png)

### 🃏 **CardComponent**
Карточка товара с изображением, названием, ценой, иконками "Избранное" и "Добавлено".  
![CardComponent Icon](https://img.icons8.com/ios-filled/50/000000/card.png)

### 🛒 **CartItem**
Компонент для отображения товара в корзине с изображением, названием, ценой и возможностью удаления из корзины.  
![CartItem Icon](https://img.icons8.com/ios-filled/50/000000/shopping-cart.png)

### 📋 **CardItemList**
Компонент для отображения списка товаров в корзине с возможностью удаления каждого товара.  
![CardItemList Icon](https://img.icons8.com/ios-filled/50/000000/clipboard.png)

### ℹ️ **InfoCardComponent**
Компонент для отображения карточки информации с изображением, заголовком и описанием.  
![InfoCardComponent Icon](https://img.icons8.com/ios-filled/50/000000/information.png)

---

## ⚙️ Функциональность

- **Поиск и сортировка**: Поиск продуктов по названию и сортировка по цене или названию.  
- **Избранное**: Возможность добавлять продукты в избранное.  
- **Автоматическое обновление**: Автоматическое обновление данных продуктов и избранного при изменении фильтров.  
- **Добавление в корзину и отправка заказа**: Возможность добавлять продукты в корзину и отправлять заказ.

---

## 💻 Рекомендуемая среда разработки

- [**VSCode**](https://code.visualstudio.com/)  
- [**Volar**](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (и отключите Vetur).

---

## 🛠️ Настройка конфигурации

См. [Vite Configuration Reference](https://vitejs.dev/config/).

---

## 📦 Установка проекта

```bash
npm install