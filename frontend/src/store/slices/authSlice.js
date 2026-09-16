import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Initialize CSRF protection (optional for Bearer token auth)
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const rootURL = baseURL.replace('/api', '');
        await api.get(`${rootURL}/sanctum/csrf-cookie`);
      } catch (e) {
        // Fallback for token-only auth environments
      }

      const response = await api.post('/login', credentials);
      localStorage.setItem('token', response.data.access_token || response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const rootURL = baseURL.replace('/api', '');
        await api.get(`${rootURL}/sanctum/csrf-cookie`);
      } catch (e) {
        // Fallback for token-only auth environments
      }

      const response = await api.post('/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Async thunk for fetching current user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/auth'; // Force redirect to login
    }
    return null;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous logout fallback if API fails
    logoutLocal(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export const { logoutLocal, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
