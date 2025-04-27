// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user'));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: savedUser ? savedUser.user : null,
    role: savedUser ? savedUser.role : null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem('user', JSON.stringify({
        user: action.payload.user,
        role: action.payload.role
      }));
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
