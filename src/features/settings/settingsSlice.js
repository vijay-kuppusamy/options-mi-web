import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import settingsService from "./settingsService";

const initialState = {
  menu: "home",
  symbols: {},
  settingsStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  settingstMessage: "",
};

export const getSymbols = createAsyncThunk(
  "settings/symbols",
  async (reqData, thunkAPI) => {
    try {
      return await settingsService.getSymbols();
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

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: (state) => {
      state.settingsStatus = "idle";
      state.settingstMessage = "";
    },
    setActiveMenu: (state, action) => {
      state.menu = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSymbols.pending, (state) => {
        state.settingsStatus = "pending";
      })
      .addCase(getSymbols.fulfilled, (state, action) => {
        state.settingsStatus = "succeeded";
        state.symbols = action.payload.symbols;
      })
      .addCase(getSymbols.rejected, (state, action) => {
        state.settingsStatus = "failed";
        state.message = action.payload;
      });
  },
});

export const { resetSettings, setActiveMenu } = settingsSlice.actions;

export default settingsSlice.reducer;
