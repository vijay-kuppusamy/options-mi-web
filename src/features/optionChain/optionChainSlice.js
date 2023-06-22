import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import optionChainService from "./optionChainService";

const initialState = {
  symbol: "",
  expiryDates: [],
  strikePrices: [],
  timestamp: "",
  spotPrice: "",
  underlyingConfig: {},
  optionData: null,
  expiry: "",
  optionChainStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  optionChainMessage: "",
};

export const getOptionChain = createAsyncThunk(
  "optionChain/getOptionChain",
  async (reqData, thunkAPI) => {
    try {
      return await optionChainService.getOptionChain(reqData);
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

export const getOptionData = createAsyncThunk(
  "optionChain/getOptionData",
  async (reqData, thunkAPI) => {
    try {
      return await optionChainService.getOptionData(reqData);
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

//
export const optionChainSlice = createSlice({
  name: "optionChain",
  initialState,
  reducers: {
    resetOptionChain: (state) => initialState,
    setExpiry: (state, action) => {
      state.expiry = action.payload;
    },
    setOptionChain: (state, action) => {
      const response = action.payload.response;
      processOptionChainResponse(state, response);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOptionChain.pending, (state) => {
        state.optionChainStatus = "pending";
      })
      .addCase(getOptionChain.fulfilled, (state, action) => {
        state.optionChainStatus = "succeeded";
        const response = action.payload.response;
        processOptionChainResponse(state, response);
      })
      .addCase(getOptionChain.rejected, (state, action) => {
        state.optionChainStatus = "failed";
        state.optionChainMessage = action.payload;
      })
      .addCase(getOptionData.pending, (state) => {
        state.optionChainStatus = "pending";
      })
      .addCase(getOptionData.fulfilled, (state, action) => {
        state.optionChainStatus = "succeeded";
        const response = action.payload.response;
        processOptionDataResponse(state, response);
      })
      .addCase(getOptionData.rejected, (state, action) => {
        state.optionChainStatus = "failed";
        state.optionChainMessage = action.payload;
      });
  },
});

function processOptionChainResponse(state, response) {
  try {
    if (response && response.optionChain && response.optionChain.underlying) {
      state.symbol = response.optionChain.underlying;
      state.spotPrice = response.optionChain.underlyingValue;
      state.expiryDates = response.optionChain.expiryDates;
      state.strikePrices = response.optionChain.strikePrices;
      state.timestamp = response.optionChain.updatedTime;
      state.underlyingConfig = response.underlyingConfig;
      state.optionData = response.optionData;
      state.expiry = response.expiryDate;
    } else {
      state.spotPrice = "";
      state.expiryDates = [];
      state.strikePrices = [];
      state.timestamp = "";
      state.underlyingConfig = {};
      state.optionData = {};
      state.expiry = "";
    }
  } catch (error) {
    console.log(error);
  }
}

function processOptionDataResponse(state, response) {
  try {
    if (response) {
      state.timestamp = response.optionChain.updatedTime;
      state.expiry = response.expiryDate;
      state.optionData = response.optionData;
    }
  } catch (error) {
    console.log(error);
  }
}

export const { resetOptionChain, setExpiry, setOptionChain } =
  optionChainSlice.actions;
export default optionChainSlice.reducer;
