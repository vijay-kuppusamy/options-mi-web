import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  //user: user ? user : null,
  user: null,
  authStatus: "idle", //'idle' | 'pending' | 'succeeded' | 'failed'
  authMessage: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
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

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Login user with google
export const loginWithGoogle = createAsyncThunk(
  "auth/login-google",
  async (user, thunkAPI) => {
    try {
      return await authService.loginWithGoogle(user);
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

// authenticate user
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (user, thunkAPI) => {
    try {
      return await authService.reset(user);
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

// authenticate user
export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async (reqData, thunkAPI) => {
    try {
      return await authService.authenticate();
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

// get user
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (reqData, thunkAPI) => {
    try {
      return await authService.getUser();
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

export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.authStatus = "idle";
      state.authMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.authStatus = "pending";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.authMessage = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.authStatus = "pending";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.payload;
        state.user = null;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.authStatus = "pending";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.payload;
        state.user = null;
      })
      .addCase(authenticate.pending, (state) => {
        state.authStatus = "pending";
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.payload;
        state.user = null;
      })
      .addCase(getUser.pending, (state) => {
        state.authStatus = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authStatus = "idle";
        state.user = null;
      })
      .addCase(logout.pending, (state) => {
        state.authStatus = "pending";
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.authStatus = "idle";
        state.authMessage = "";
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.authStatus = "failed";
        state.authMessage = "";
      })
      .addCase(resetPassword.pending, (state) => {
        state.authStatus = "pending";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.authMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.payload;
        state.user = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
