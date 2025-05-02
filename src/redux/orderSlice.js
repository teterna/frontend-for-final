// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/orders'; // Базовый URL для заказов

// Helper для получения токена
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

// Async Thunks

// 1. Создание нового заказа (POST /orders)
export const createOrderAsync = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(API_URL, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // { message: "...", order_id: ... }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create order';
      toast.error(`Ошибка создания заказа: ${message}`);
      return rejectWithValue(message);
    }
  }
);

// 2. Получение всех заказов (GET /orders)
export const fetchOrdersAsync = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Массив заказов
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch orders';
      // Не показываем toast для fetch, чтобы не спамить при загрузке страницы
      return rejectWithValue(message);
    }
  }
);

// 3. Получение конкретного заказа (GET /orders/{order_id})
export const fetchOrderByIdAsync = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Объект заказа
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);

// 4. Обновление статуса заказа (PUT/PATCH /orders/{order_id})
export const updateOrderStatusAsync = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${API_URL}/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { orderId, status }; // Возвращаем ID и новый статус для обновления в state
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update order status';
      toast.error(`Ошибка обновления статуса: ${message}`);
      return rejectWithValue(message);
    }
  }
);

// 5. Удаление заказа (DELETE /orders/{order_id})
export const deleteOrderAsync = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return orderId; // Возвращаем ID удаленного заказа
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete order';
      toast.error(`Ошибка удаления заказа: ${message}`);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  currentOrder: null, // Для хранения деталей одного заказа
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
        state.currentOrder = null;
    }
    // Можно добавить другие синхронные редьюсеры при необходимости
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Не добавляем в items сразу, т.к. ответ содержит только ID
        // Можно обновить список заказов после успешного создания
        toast.success(action.payload.message || 'Заказ успешно создан!');
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Orders
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order By ID
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatusAsync.pending, (state) => {
        // Можно добавить индикатор загрузки для конкретного заказа, если нужно
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const index = state.items.findIndex(order => order.id === orderId);
        if (index !== -1) {
          state.items[index].status = status;
        }
        if (state.currentOrder && state.currentOrder.id === orderId) {
            state.currentOrder.status = status;
        }
        toast.success('Статус заказа успешно обновлен!');
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        // Обработка ошибки (уже сделана в thunk через toast)
      })

      // Delete Order
      .addCase(deleteOrderAsync.pending, (state) => {
        // Можно добавить индикатор загрузки
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(order => order.id !== action.payload);
        if (state.currentOrder && state.currentOrder.id === action.payload) {
            state.currentOrder = null; // Очистить текущий заказ, если он был удален
        }
        toast.success('Заказ успешно удален!');
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        // Обработка ошибки (уже сделана в thunk через toast)
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;