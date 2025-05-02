import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice'; // Добавлено
import animalReducer from './animalSlice';
import vetReducer from './vetSlice';
import userReducer from './userSlice'; // Добавлено для управления пользователями
import orderReducer from './orderSlice'; // Добавляем редьюсер заказов
import cartReducer from './cartSlice'; // Добавляем редьюсер корзины
import appointmentReducer from './appointmentSlice'; // Добавляем редьюсер записей
import chatReducer from './chatSlice'; // Добавляем редьюсер чата

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer, // Добавлено
    animals: animalReducer,
    vets: vetReducer,
    users: userReducer, // Добавлено для управления пользователями
    orders: orderReducer, // Добавляем редьюсер заказов
    cart: cartReducer, // Добавляем редьюсер корзины
    appointments: appointmentReducer, // Добавляем редьюсер записей
    chat: chatReducer, // Добавляем редьюсер чата
  },
});

export default store;
