import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';

const store = configureStore({
  reducer: {
    userLogin: authReducer,
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
