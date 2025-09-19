import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isLoggedIn: false
  },
  reducers: {
    login: (state: any, action: any) => {
      state.data = action.payload;
      state.isLoggedIn = true;
      const token = action.payload.access_token
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
    },
    logout: (state: any) => {
      state.data = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
