import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import reservationReducer from './slices/reservationSlice';
import spaceReducer from './slices/spaceSlice';
import userReducer from './slices/userSlice';
import scheduleReducer from './slices/scheduleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    reservations: reservationReducer,
    spaces: spaceReducer,
    users: userReducer,
    schedules: scheduleReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
