import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  userId: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userInfo = action.payload.userInfo;
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.userId = null;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.userId = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, clearUser, setError, clearError, logoutUser } = userSlice.actions;

export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserId = (state) => state.user.userId;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
