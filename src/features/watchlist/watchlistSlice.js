import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import watchlistService from "./watchlistService";

const initialState = {
  watchlist: [],
  watchlistStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  watchlistMessage: "",
};

function constructWatchList(positions) {
  let watchlist = {
    user: "",
    underlying: "",
    expiryDate: "",
    positions: [],
  };
  if (positions && positions.length > 0) {
    let position = positions[0];
    watchlist.underlying = position.symbol;
    watchlist.expiryDate = position.expiryDate;
    watchlist.positions = positions;
  }
  return watchlist;
}

export const saveWatchlist = createAsyncThunk(
  "watchlist/saveWatchlist",
  async (reqData, thunkAPI) => {
    try {
      let watchlist = constructWatchList(reqData);
      return await watchlistService.saveWatchlist(watchlist);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteWatchlist = createAsyncThunk(
  "watchlist/deleteWatchlist",
  async (reqData, thunkAPI) => {
    try {
      return await watchlistService.deleteWatchlist(reqData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getWatchlist = createAsyncThunk(
  "watchlist/getWatchlist",
  async (reqData, thunkAPI) => {
    try {
      return await watchlistService.getWatchlist(reqData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    watchlistReset: (state) => {
      state.watchlistStatus = "idle";
      state.watchlistMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveWatchlist.pending, (state) => {
        state.watchlistStatus = "pending";
      })
      .addCase(saveWatchlist.fulfilled, (state, action) => {
        state.watchlistStatus = "succeeded";
        state.watchlistMessage = action.payload.message;
      })
      .addCase(saveWatchlist.rejected, (state, action) => {
        state.watchlistStatus = "failed";
        state.watchlistMessage = action.payload;
      })
      .addCase(getWatchlist.pending, (state) => {
        state.watchlistStatus = "pending";
      })
      .addCase(getWatchlist.fulfilled, (state, action) => {
        state.watchlistStatus = "succeeded";
        state.watchlist = action.payload.response;
      })
      .addCase(getWatchlist.rejected, (state, action) => {
        state.watchlistStatus = "failed";
        state.watchlistMessage = action.payload;
      })
      .addCase(deleteWatchlist.pending, (state) => {
        state.watchlistStatus = "pending";
      })
      .addCase(deleteWatchlist.fulfilled, (state, action) => {
        state.watchlistStatus = "succeeded";
        state.watchlistMessage = action.payload.message;
      })
      .addCase(deleteWatchlist.rejected, (state, action) => {
        state.watchlistStatus = "failed";
        state.watchlistMessage = action.payload;
      });
  },
});

export const { watchlistReset } = watchlistSlice.actions;

export default watchlistSlice.reducer;
