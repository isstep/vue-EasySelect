import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => ({
    cartFood: [],
    foods: [],
    filters: {
      sortBy: 'title',
      searchQuery: ''
    }
  }),
  getters: {
    sortedFoods: (state) => {
      let sorted = [...state.foods]
      if (state.filters.searchQuery) {
        sorted = sorted.filter((food) =>
          food.title.toLowerCase().includes(state.filters.searchQuery.toLowerCase())
        )
      }
      if (state.filters.sortBy === 'price') {
        return sorted.sort((a, b) => a.price - b.price)
      } else if (state.filters.sortBy === '-price') {
        return sorted.sort((a, b) => b.price - a.price)
      } else {
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      }
    }
  },
  actions: {
    async fetchFoods() {
      try {
        const params = {
          sortBy: this.filters.sortBy
        }
        if (this.filters.searchQuery) {
          params.title = `*${this.filters.searchQuery}*`
        }
        const { data } = await axios.get('https://f4f1d0c1ac4cb845.mokky.dev/foods', { params })
        const foods = data.map((obg) => ({
          ...obg,
          isFavorite: false,
          isAdded: this.cartFood.some((item) => item.id === obg.id),
          favoriteId: null
        }))
        this.foods = foods
      } catch (err) {
        console.log(err)
      }
    },
    async fetchFavorites() {
      try {
        const { data: favorites } = await axios.get('https://f4f1d0c1ac4cb845.mokky.dev/favorites')
        this.foods = this.foods.map((food) => {
          const favorite = favorites.find((fav) => fav.parentId === food.id)
          return favorite ? { ...food, isFavorite: true, favoriteId: favorite.id } : food
        })
      } catch (err) {
        console.log(err)
      }
    },
    async toggleFavorite(food) {
      try {
        if (!food.isFavorite) {
          const { data } = await axios.post('https://f4f1d0c1ac4cb845.mokky.dev/favorites', {
            parentId: food.id,
            food
          })
          food.isFavorite = true
          food.favoriteId = data.id
        } else {
          await axios.delete(`https://f4f1d0c1ac4cb845.mokky.dev/favorites/${food.favoriteId}`)
          food.isFavorite = false
          food.favoriteId = null
        }
        this.foods = this.foods.map((f) => (f.id === food.id ? food : f))
      } catch (err) {
        console.log(err)
      }
    },
    loadCartFromLocalStorage() {
      const localCartFood = localStorage.getItem('cartFood')
      this.cartFood = localCartFood ? JSON.parse(localCartFood) : []
    },
    updateCart() {
      const localCartFood = localStorage.getItem('cartFood')
      this.cartFood = localCartFood ? JSON.parse(localCartFood) : []
    }
  }
})
