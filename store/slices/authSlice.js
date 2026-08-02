import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axios.post('/api/auth/logout')
})

export const fetchProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/auth/profile')
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Not authenticated')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/api/auth/profile', profileData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    profileLoading: false,
    // Bumped on every login/register/logout. fetchProfile snapshots this at
    // dispatch time and checks it again on completion — if a login or
    // logout happened in between, its result is stale and gets dropped
    // instead of clobbering newer state. Needed because the bootstrap
    // fetchProfile() (checking the httpOnly cookie on app load) can still
    // be in flight when the user submits the login form and finishes
    // second, otherwise its rejection flips a just-logged-in user back to
    // logged out.
    authVersion: 0,
    profileCheckVersion: -1,
  },
  reducers: {
    clearAuthError(state) { state.error = null },
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    setPhoneVerified(state, action) {
      if (state.user) {
        state.user.phone = action.payload.phone
        state.user.isPhoneVerified = true
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.authVersion += 1
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.authVersion += 1
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.authVersion += 1
    })

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true
        state.profileCheckVersion = state.authVersion
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false
        if (state.authVersion !== state.profileCheckVersion) return // a login/logout happened while this was in flight
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.profileLoading = false
        if (state.authVersion !== state.profileCheckVersion) return // a login/logout happened while this was in flight
        state.isAuthenticated = false
        state.user = null
      })

    // Update Profile
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
  },
})

export const { clearAuthError, setCredentials, setPhoneVerified } = authSlice.actions
export default authSlice.reducer
