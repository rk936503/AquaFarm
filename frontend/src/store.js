import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice';
import waterUsageReducer from './slices/waterUsageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    waterUsage: waterUsageReducer,
  },
});

export default store;
