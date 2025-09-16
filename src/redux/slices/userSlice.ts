import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data:null,
    isLoggedIn:false
  },
  reducers: {
    login: (state:any, action:any) => {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state:any) => {
      state.data = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
