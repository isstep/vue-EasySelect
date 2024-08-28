<template>
    <div id="loginModal" class="modal">
    <div class="modal-content">
        <div class="close-btn">&times;
     </div>
        <form>
            <h2 class="text-join-modal">Войти в систему</h2>
            <label for="email"></label>
            <input type="text" id="email" name="email" placeholder="Email/Телефон">
            
            <label class="password-label" for="password"></label>
            <input type="password" id="password" name="password" placeholder="Пароль">
            
            <label>
                <input class="text-modal-remember" type="checkbox" name="remember"  placeholder=""> Запомнить пароль
            </label>
            
            <a href="#">Восстановить</a>
            <button type="submit">Войти</button>
            <button type="button">Зарегистрироваться</button>
        </form>
    </div>
</div>
</template>

 <style scoped>
</style>