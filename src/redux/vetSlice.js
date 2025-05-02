// src/redux/vetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching vets
export const fetchVets = createAsyncThunk(
  'vets/fetchVets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/vets');
      if (!response.ok) {
        throw new Error('Server error!');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const vetSlice = createSlice({
  name: 'vets',
  initialState,
  reducers: {
    // Potential future reducers for adding/updating/deleting vets
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vetSlice.reducer;