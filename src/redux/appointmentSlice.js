// src/redux/appointmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Helper to get token
const getToken = (getState) => {
  const { token } = getState().auth.user;
  return token;
};

// Async thunk for fetching appointments
export const fetchAppointmentsAsync = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    if (!token) return rejectWithValue('No token found');
    try {
      const response = await fetch('http://localhost:5000/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating an appointment
export const createAppointmentAsync = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    if (!token) return rejectWithValue('No token found');
    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }
      const data = await response.json();
      toast.success('Запись успешно создана!');
      return data.appointment; // Assuming the backend returns the created appointment
    } catch (error) {
      toast.error(`Ошибка создания записи: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating an appointment
export const updateAppointmentAsync = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ appointmentId, updateData }, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    if (!token) return rejectWithValue('No token found');
    try {
      const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
        method: 'PUT', // or PATCH depending on your backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }
      const data = await response.json();
      toast.success('Запись успешно обновлена!');
      // Return the ID and the updated data to update the state
      return { id: appointmentId, changes: updateData };
    } catch (error) {
      toast.error(`Ошибка обновления записи: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting an appointment
export const deleteAppointmentAsync = createAsyncThunk(
  'appointments/deleteAppointment',
  async (appointmentId, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    if (!token) return rejectWithValue('No token found');
    try {
      const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete appointment');
      }
      toast.success('Запись успешно удалена!');
      return appointmentId; // Return the ID of the deleted appointment
    } catch (error) {
      toast.error(`Ошибка удаления записи: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointmentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointmentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Appointment
      .addCase(createAppointmentAsync.pending, (state) => {
        state.loading = true; // Or a specific loading state for creation
      })
      .addCase(createAppointmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createAppointmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Or handle error specifically
      })
      // Update Appointment
      .addCase(updateAppointmentAsync.pending, (state) => {
        state.loading = true; // Or a specific loading state for update
      })
      .addCase(updateAppointmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          // Merge the changes into the existing appointment
          state.items[index] = { ...state.items[index], ...action.payload.changes };
        }
      })
      .addCase(updateAppointmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Appointment
      .addCase(deleteAppointmentAsync.pending, (state) => {
        state.loading = true; // Or a specific loading state for deletion
      })
      .addCase(deleteAppointmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(app => app.id !== action.payload);
      })
      .addCase(deleteAppointmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;