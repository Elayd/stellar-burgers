import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { RootState } from 'src/services/store';

interface IOrderState {
  order: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoadingNumber: boolean;
  isLoadingOrder: boolean;
}

const initialState: IOrderState = {
  order: [],
  orderRequest: false,
  orderModalData: null,
  isLoadingNumber: true,
  isLoadingOrder: true
};

const ORDER_CREATE = 'order/createOrder';
const ORDER_FETCH_BY_NUMBER = 'orders/fetchOrder';
const ORDER_FETCH_ALL = 'orders/fetchOrders';

export const createOrder = createAsyncThunk<
  {
    order: TOrder;
    name: string;
  },
  string[]
>(ORDER_CREATE, async (ingredients, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(ingredients);
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка создания заказа'
    );
  }
});

export const fetchOrder = createAsyncThunk(
  ORDER_FETCH_ALL,
  async () => await getOrdersApi()
);

export const fetchOrderNumber = createAsyncThunk<TOrder, number>(
  ORDER_FETCH_BY_NUMBER,
  async (data, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModalData(state) {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.isLoadingOrder = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.isLoadingOrder = false;
      })
      .addCase(fetchOrderNumber.pending, (state) => {
        state.isLoadingNumber = true;
      })
      .addCase(fetchOrderNumber.fulfilled, (state, action) => {
        state.isLoadingNumber = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrderNumber.rejected, (state) => {
        state.isLoadingNumber = false;
      });
  }
});

export const selectOrderRequest = (state: { order: IOrderState }) =>
  state.order.orderRequest;
export const selectOrders = (state: { order: IOrderState }): TOrder[] =>
  state.order.order;
export const selectOrderModalData = (state: { order: IOrderState }) =>
  state.order.orderModalData;

export const orderDataSelector = (number: string) => (state: RootState) => {
  if (state.order.order?.length) {
    const data = state.order.order.find(
      (order) => order.number === Number(number)
    );
    if (data) return data;
  }

  if (state.feed.feed?.orders.length) {
    const data = state.feed.feed?.orders?.find(
      (order) => order.number === Number(number)
    );
    if (data) return data;
  }

  if (state.order.orderModalData?.number) {
    return state.order.orderModalData;
  }

  return null;
};

export const { closeOrderModalData } = orderSlice.actions;

export default orderSlice.reducer;
