import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface FeedState {
  feed: TOrdersData | null;
  loading: boolean;
}

const initialState: FeedState = {
  feed: null,
  loading: false
};

const FEED_FETCH = 'feed/fetch';

export const feedThunk = createAsyncThunk(
  FEED_FETCH,
  async () => await getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(feedThunk.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const selectLoading = (state: { feed: FeedState }) => state.feed.loading;
export const selectFeed = (state: { feed: FeedState }) => state.feed.feed;
export const selectOrders = (state: { feed: FeedState }) =>
  state.feed?.feed?.orders || [];

export default feedSlice.reducer;
