import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchSpaces = createAsyncThunk(
  'spaces/fetchSpaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/spaces');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spaces');
    }
  }
);

const spaceSlice = createSlice({
  name: 'spaces',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default spaceSlice.reducer;
