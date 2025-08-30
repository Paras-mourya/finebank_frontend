import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;

// ---------------- THUNKS ----------------

export const registerUser = createAsyncThunk("user/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/register", data);
    return { user: res.data.user, message: "Registration successful!" };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/login", data);
    return { user: res.data.user, message: "Login successful!" };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put("/api/users/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { user: res.data.user, message: "Profile updated successfully!" };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

export const changePassword = createAsyncThunk("user/changePassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    const res = await api.put("/api/users/change-password", { currentPassword, newPassword });
    return { message: res.data.message || "Password changed successfully!" };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Password change failed");
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/reset", { email });
    return { message: res.data.message || "Password reset link sent!" };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Forgot password failed");
  }
});

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/users/reset/${resetToken}`, { password });
      return { message: res.data.message || "Password reset successful!" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset password failed");
    }
  }
);


export const getProfile = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/users/me");
    return { user: res.data.user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
  }
});

// ---------------- SLICE ----------------

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null, 
  },
  reducers: {
    logoutSuccess: (state) => {
      state.user = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
     clearForgotError: (state) => {
      state.error = null;
    },
    clearForgotSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = action.payload.message;
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
        state.user = action.payload.user;
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
        state.user = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutSuccess, clearMessages,clearForgotError,clearForgotSuccess } = userSlice.actions;
export default userSlice.reducer;
