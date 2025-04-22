import { combineReducers, configureStore } from '@reduxjs/toolkit';
import builderReducer from './slices/builderSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  feed: feedReducer,
  builder: builderReducer,
  user: userReducer,
  ingredients: ingredientsReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
