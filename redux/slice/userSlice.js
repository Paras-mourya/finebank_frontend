import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;

export const registerUser = createAsyncThunk("user/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/register", data);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/login", data);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/users/change-password", {
        oldPassword,
        newPassword,
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password change failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/users/reset", { email });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Forgot password failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/users/reset/${resetToken}`, { password });
      return res.data.messgae || res.data.message; // backend me spelling mistake hai messgae
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset password failed");
    }
  }
);

export const getProfile = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/users/me");
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, loading: false, error: null, successMessage: null, success: null },
  reducers: {
    logoutSuccess: (state) => {
      state.user = null;
    },
    clearForgotError: (state) => {
      state.error = null;
    },
    clearForgotSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // update user in redux
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload; // message from backend
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutSuccess, clearForgotError, clearForgotSuccess } = userSlice.actions;
export default userSlice.reducer;
