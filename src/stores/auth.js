import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

// Вспомогательная функция для инициализации пользователя из токена
function initializeUserFromToken(token) {
  if (!token) {
    return null; // Нет токена - нет пользователя
  }
  try {
    const decoded = jwtDecode(token);
    console.log('Initializing user from stored token:', decoded);

    // --- ВАЖНО: Проверка срока действия токена ---
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < nowInSeconds) {
      console.warn('Stored token has expired. Clearing auth state.');
      localStorage.removeItem('authToken'); // Удаляем просроченный токен
      return null; // Считаем, что пользователя нет
    }
    // --- Конец проверки срока действия ---

    // Возвращаем объект пользователя, если токен валиден и не просрочен
    return {
      id: decoded.uid || null,
      email: decoded.email || null,
      // Раскомментируй и добавь другие поля, если они есть в твоем токене
      // firstName: decoded.firstName || null,
      // lastName: decoded.lastName || null,
      // address: decoded.address || null
    };
  } catch (error) {
    console.error('Error decoding token during store initialization:', error);
    // Если токен невалидный, удаляем его
    localStorage.removeItem('authToken');
    return null; // Не удалось декодировать - пользователя нет
  }
}

export const useAuthStore = defineStore('auth', {
  // Используем функцию для инициализации состояния
  state: () => {
    const token = localStorage.getItem('authToken');
    const user = initializeUserFromToken(token); // Пытаемся загрузить пользователя

    return {
      // isAuthenticated теперь зависит от успешной загрузки пользователя
      isAuthenticated: !!user, // true если user не null
      token: token || '',
      user: user // Инициализируем пользователя
    };
  },
  actions: {
    login(token) {
      try {
        // Декодируем *перед* сохранением, чтобы убедиться что токен валиден
        const decoded = jwtDecode(token);
        const nowInSeconds = Math.floor(Date.now() / 1000);

        // Проверяем срок годности перед логином
        if (decoded.exp && decoded.exp < nowInSeconds) {
           console.error('Login attempt with expired token.');
           this.logout(); // Выходим, если токен уже просрочен
           // Можно выбросить ошибку или вернуть false, чтобы компонент знал о неудаче
           throw new Error('Token expired');
        }

        // Если все ок, сохраняем и обновляем состояние
        localStorage.setItem('authToken', token);
        this.token = token;
        this.isAuthenticated = true;
        // Обновляем пользователя данными из нового токена
        this.user = {
          id: decoded.uid || null,
          email: decoded.email || null,
          // firstName: decoded.firstName || null,
          // lastName: decoded.lastName || null,
          // address: decoded.address || null
        };
         console.log('Login successful, user state updated:', this.user);
      } catch (error) {
         console.error('Login failed - Error decoding token or token expired:', error);
         this.logout(); // Сбрасываем состояние в случае ошибки
         // Перебрасываем ошибку, чтобы компонент мог ее обработать
         throw error;
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      this.token = '';
      this.user = null;
      this.isAuthenticated = false;
      console.log('User logged out.');
    },
    // loadUserFromToken больше не нужен для инициализации,
    // но может быть полезен для обновления данных пользователя без перезагрузки,
    // если токен может обновиться. Оставим его на всякий случай,
    // но убедимся, что он корректно обрабатывает ошибки и обновляет isAuthenticated.
    loadUserFromToken(token) {
       // Эта функция теперь дублирует логику login и initializeUserFromToken.
       // Возможно, ее стоит удалить или переиспользовать initializeUserFromToken.
       // Пока оставим как есть, но добавим обработку ошибок и синхронизацию isAuthenticated.
      try {
        const userFromToken = initializeUserFromToken(token); // Используем общую логику
        if (userFromToken) {
          this.user = userFromToken;
          this.isAuthenticated = true; // Убедимся, что статус синхронизирован
          this.token = token; // И токен тоже
          console.log('User data reloaded from token:', this.user);
        } else {
          // Если initializeUserFromToken вернул null (токен невалиден/просрочен)
          this.logout();
        }
      } catch (error) {
        // Эта ошибка не должна возникать, т.к. initializeUserFromToken ее ловит,
        // но на всякий случай:
        console.error('Unexpected error in loadUserFromToken:', error);
        this.logout();
      }
    }
    // loadToken() теперь не нужен, так как инициализация происходит в state()
    // Если ты его где-то вызывал вручную, замени вызов на loadUserFromToken(this.token)
    // или просто удали, если он использовался только для инициализации.
  },
  // Дополнительно: геттеры для удобства
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    getToken: (state) => state.token,
    getUserId: (state) => state.user?.id, // Безопасный доступ к id
    getUserEmail: (state) => state.user?.email, // Безопасный доступ к email
  }
});