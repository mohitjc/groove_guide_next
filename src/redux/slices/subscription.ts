import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "subscription",
  initialState: {
    data:null,
  },
  reducers: {
    subscription_success: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { subscription_success } = userSlice.actions;
export default userSlice.reducer;
