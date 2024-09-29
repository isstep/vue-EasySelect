import { ref } from 'vue';

export function useSmartCart() {
  const cart = ref([]);

  const addToCart = (product) => {
    cart.value.push(product);
  };

  const calculateTotal = () => {
    return cart.value.reduce((total, product) => total + product.price, 0);
  };

  return {
    cart,
    addToCart,
    calculateTotal,
  };
}
