<script setup>
import { ref, onMounted } from 'vue'; 
import axios from 'axios';
import CardList from '../components/CardList.vue';
import { useRouter } from 'vue-router';

const favorites = ref([]);
const router = useRouter();

const loadFavorites = async () => {
  try {
    const { data } = await axios.get(
      `https://f4f1d0c1ac4cb845.mokky.dev/favorites?_relations=foods`
    );
    console.log('Raw data from favorites:', data); 
    favorites.value = data.map((obj) => {
      console.log('Mapping object:', obj); 
      if (!obj || typeof obj.id === 'undefined' || !obj.food) {
         console.warn('Skipping invalid object from favorites:', obj);
         return null; 
      }
      return {
        favoriteId: obj.id, 
        ...obj.food 
      };
    }).filter(Boolean);
    console.log('Mapped favorites:', JSON.stringify(favorites.value, null, 2));
  } catch (err) {
    console.error('Ошибка загрузки избранного:', err); 
  }
};

onMounted(async () => {
  await loadFavorites();
});

const goToHome = () => {
  router.push('/');
};

const removeFromFavorites = async (foodId) => {

  try {
    const favoriteToRemove = favorites.value.find(fav => fav && fav.id === foodId); 
    const favoriteEntryId = favoriteToRemove.favoriteId;

    const deleteUrl = `https://f4f1d0c1ac4cb845.mokky.dev/favorites/${favoriteEntryId}`;
    console.log(`Sending DELETE request to: ${deleteUrl}`); 
    await axios.delete(deleteUrl);

    favorites.value = favorites.value.filter((fav) => fav && fav.id !== foodId); 

  } catch (error) {
    if (error.response) {
      console.error('Server Response Status:', error.response.status);
      console.error('Server Response Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Axios setup error:', error.message);
    }
    const attemptedFavoriteEntryId = favorites.value.find(fav => fav && fav.id === foodId)?.favoriteId;
    console.error(`Attempted to use favoriteEntryId: ${attemptedFavoriteEntryId}`);
  }
};
</script>

<template>
  <div class="mt-20">
    <h2 class="text-3xl font-bold mb-8">Избранные товары</h2>

    <div v-if="!favorites || favorites.length === 0" class="text-center mt-20">
      <p class="text-lg mb-10">Здесь нету избранных товаров, добавьте их!</p>
      <button
        @click="goToHome"
        class="h-10  px-5 bg-emerald-500 text-white transition-colors duration-150 bg-customGreen rounded-full focus:shadow-outline hover:bg-emerald-700"
      >
        На главную
      </button>
    </div>
    <CardList
        v-else
        :foods="favorites"
        is-favorites
        @remove-from-favorites="removeFromFavorites"
      />
  </div>
</template>