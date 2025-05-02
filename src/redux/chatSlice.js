import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Базовый URL API
const API_URL = 'http://localhost:5000/chat';

// Асинхронные thunk-действия
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Не удалось загрузить историю чата');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Если есть файл, используем FormData
      if (file) {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('file', file);
        
        const response = await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Если файла нет, отправляем обычный JSON
        const response = await axios.post(API_URL, { message }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Не удалось отправить сообщение');
    }
  }
);

// Создание slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
    sendingMessage: false,
    sendError: null
  },
  reducers: {
    clearChatErrors: (state) => {
      state.error = null;
      state.sendError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchChatHistory
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка при загрузке истории чата';
      })
      
      // Обработка sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.sendError = action.payload || 'Произошла ошибка при отправке сообщения';
      });
  }
});

export const { clearChatErrors } = chatSlice.actions;
export default chatSlice.reducer;