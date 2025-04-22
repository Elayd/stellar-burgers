import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface TUserState {
  isChecked: boolean;
  isAuthenticated: boolean;
  error?: string;
  data: TUser | null;
}

export const initialState: TUserState = {
  isChecked: false,
  isAuthenticated: false,
  data: null
};

const REGISTER_USER = 'user/register';
const LOGIN_USER = 'user/login';
const LOGOUT_USER = 'user/logout';
const FETCH_USER = 'user/fetchUser';
const UPDATE_USER = 'user/update';

export const register = createAsyncThunk<TUser, TRegisterData>(
  REGISTER_USER,
  async (dataUser, { rejectWithValue }) => {
    const data = await registerUserApi(dataUser);
    if (!data.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  LOGIN_USER,
  async (dataUser, { rejectWithValue }) => {
    const data = await loginUserApi(dataUser);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logout = createAsyncThunk<void, void>(
  LOGOUT_USER,
  async (_, { dispatch }) => {
    await logoutApi().then(() => {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
    });
  }
);

export const fetchUser = createAsyncThunk(
  FETCH_USER,
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  UPDATE_USER,
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.error = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.error = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.error = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isChecked = true;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export const selectUserData = (state: { user: TUserState }) => state.user.data;
export const selectIsChecked = (state: { user: TUserState }) =>
  state.user.isChecked;
export const selectError = (state: { user: TUserState }) => state.user.error;

export default userSlice.reducer;
