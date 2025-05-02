// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  products: [], // { id, name, price, quantity }
  pets: [],     // { id, name, species, price }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const product = action.payload; // Ожидаем { id, name, price }
      const existingProduct = state.products.find(p => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.products.push({ ...product, quantity: 1 });
      }
      toast.info(`${product.name} добавлен в корзину.`);
    },
    removeProductFromCart: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter(p => p.id !== productId);
      toast.info('Товар удален из корзины.');
    },
    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        if (quantity > 0) {
          product.quantity = quantity;
        } else {
          // Если количество 0 или меньше, удаляем товар
          state.products = state.products.filter(p => p.id !== productId);
          toast.info('Товар удален из корзины.');
        }
      }
    },
    addPetToCart: (state, action) => {
      const pet = action.payload; // Ожидаем { id, name, species, price }
      const existingPet = state.pets.find(p => p.id === pet.id);
      if (!existingPet) {
        state.pets.push(pet);
        toast.info(`${pet.name} добавлен в корзину.`);
      } else {
        toast.warn(`${pet.name} уже в корзине.`);
      }
    },
    removePetFromCart: (state, action) => {
      const petId = action.payload;
      state.pets = state.pets.filter(p => p.id !== petId);
      toast.info('Питомец удален из корзины.');
    },
    clearCart: (state) => {
      state.products = [];
      state.pets = [];
      toast.info('Корзина очищена.');
    },
  },
});

export const {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  addPetToCart,
  removePetFromCart,
  clearCart,
} = cartSlice.actions;

// Селекторы для удобства
export const selectCartProducts = (state) => state.cart.products;
export const selectCartPets = (state) => state.cart.pets;
export const selectCartTotalItems = (state) => 
    state.cart.products.reduce((sum, p) => sum + p.quantity, 0) + state.cart.pets.length;
export const selectCartTotalPrice = (state) => {
    const productsTotal = state.cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const petsTotal = state.cart.pets.reduce((sum, p) => sum + p.price, 0);
    return productsTotal + petsTotal;
};

export default cartSlice.reducer;