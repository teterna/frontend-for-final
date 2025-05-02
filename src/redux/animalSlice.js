import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch animals
export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/pets');
      if (!response.ok) throw new Error('Server error!');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add animal
export const addAnimalAsync = createAsyncThunk(
  'animals/addAnimalAsync',
  async (newAnimal, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAnimal),
      });
      if (!response.ok) throw new Error('Cannot add animal!');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update animal
export const updateAnimalAsync = createAsyncThunk(
  'animals/updateAnimalAsync',
  async (animal, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/pets/${animal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(animal),
      });
      if (!response.ok) throw new Error('Cannot update animal!');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete animal
export const deleteAnimalAsync = createAsyncThunk(
  'animals/deleteAnimalAsync',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/pets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (!response.ok) throw new Error('Cannot delete animal!');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const animalSlice = createSlice({
  name: 'animals',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAnimalAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateAnimalAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteAnimalAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { setLoading, setError } = animalSlice.actions;
export default animalSlice.reducer;
