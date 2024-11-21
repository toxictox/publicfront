import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});
export const { reducer } = authSlice;

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
