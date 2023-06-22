import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import portfolioService from "./portfolioService";

const initialState = {
  portfolio: [],
  portfolioStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  portfolioMessage: "",
};

function constructPortfolio(positions) {
  let portfolio = {
    user: "",
    underlying: "",
    expiryDate: "",
    positions: [],
  };
  if (positions && positions.length > 0) {
    let position = positions[0];
    portfolio.underlying = position.symbol;
    portfolio.expiryDate = position.expiryDate;
    portfolio.positions = positions;
  }
  return portfolio;
}

export const savePortfolio = createAsyncThunk(
  "portfolio/savePortfolio",
  async (reqData, thunkAPI) => {
    try {
      let portfolio = constructPortfolio(reqData);
      return await portfolioService.savePortfolio(portfolio);
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

export const deletePortfolio = createAsyncThunk(
  "portfolio/deletePortfolio",
  async (reqData, thunkAPI) => {
    try {
      return await portfolioService.deletePortfolio(reqData);
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

export const getPortfolio = createAsyncThunk(
  "portfolio/getPortfolio",
  async (reqData, thunkAPI) => {
    try {
      return await portfolioService.getPortfolio(reqData);
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

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    portfolioReset: (state) => {
      state.portfolioStatus = "idle";
      state.portfolioMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePortfolio.pending, (state) => {
        state.portfolioStatus = "idle";
      })
      .addCase(savePortfolio.fulfilled, (state, action) => {
        state.portfolioStatus = "succeeded";
        state.portfolioMessage = action.payload.message;
      })
      .addCase(savePortfolio.rejected, (state, action) => {
        state.portfolioStatus = "failed";
        state.portfolioMessage = action.payload;
      })
      .addCase(getPortfolio.pending, (state) => {
        state.portfolioStatus = "pending";
      })
      .addCase(getPortfolio.fulfilled, (state, action) => {
        state.portfolioStatus = "succeeded";
        state.portfolio = action.payload.response;
      })
      .addCase(getPortfolio.rejected, (state, action) => {
        state.portfolioStatus = "failed";
        state.portfolioMessage = action.payload;
      })
      .addCase(deletePortfolio.pending, (state) => {
        state.portfolioStatus = "pending";
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.portfolioStatus = "succeeded";
        state.portfolioMessage = action.payload.message;
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.portfolioStatus = "failed";
        state.portfolioMessage = action.payload;
      });
  },
});

export const { portfolioReset } = portfolioSlice.actions;

export default portfolioSlice.reducer;
