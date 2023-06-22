import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "./accountService";

const initialState = {
  user: {},
  accountStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  accountMessage: "",
};

export const saveUser = createAsyncThunk(
  "account/saveUsert",
  async (reqData, thunkAPI) => {
    try {
      return await accountService.saveUser(reqData);
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

export const getUser = createAsyncThunk(
  "account/getUser",
  async (reqData, thunkAPI) => {
    try {
      return await accountService.getUser(reqData);
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

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    accountReset: (state) => {
      state.accountStatus = "idle";
      state.accountMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUser.pending, (state) => {
        state.accountStatus = "pending";
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.accountStatus = "succeeded";
        state.accountMessage = action.payload.message;
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.accountStatus = "failed";
        state.accountMessage = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.accountStatus = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.accountStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.accountStatus = "failed";
        state.accountMessage = action.payload;
      });
  },
});

export const { accountReset } = accountSlice.actions;

export default accountSlice.reducer;
