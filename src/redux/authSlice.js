// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user'));
const savedToken = localStorage.getItem('token');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: savedUser ? savedUser.user : null,
    role: savedUser ? savedUser.role : null,
    token: savedToken ? savedToken : null, // Load token from localStorage
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token; // Save token to state
      localStorage.setItem('user', JSON.stringify({
        user: action.payload.user,
        role: action.payload.role
      }));
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null; // Clear token from state
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Remove token from localStorage
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;