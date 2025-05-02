// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk для загрузки продуктов
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/products'); // Используем порт 5000
      if (!response.ok) {
        throw new Error('Не удалось загрузить продукты');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk для добавления продукта
export const addProductAsync = createAsyncThunk(
  'products/addProductAsync',
  async (productData, { rejectWithValue, getState }) => {
    const { token } = getState().auth; // Получаем токен
    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Добавляем токен авторизации
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось добавить продукт');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk для обновления продукта
export const updateProductAsync = createAsyncThunk(
  'products/updateProductAsync',
  async ({ id, productData }, { rejectWithValue, getState }) => {
    const { token } = getState().auth; // Получаем токен
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Добавляем токен авторизации
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось обновить продукт');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk для удаления продукта
export const deleteProductAsync = createAsyncThunk(
  'products/deleteProductAsync',
  async (id, { rejectWithValue, getState }) => {
    const { token } = getState().auth; // Получаем токен
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Добавляем токен авторизации
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось удалить продукт');
      }
      // API может не возвращать тело при DELETE, возвращаем ID для обновления состояния
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Product
      .addCase(addProductAsync.pending, (state) => {
        state.loading = true; // Можно установить loading или специфичный флаг
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Добавляем новый продукт в массив
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Сохраняем ошибку
      })
      // Update Product
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; // Обновляем продукт в массиве
        }
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload); // Удаляем продукт из массива по ID
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;