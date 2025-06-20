import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromCookie: (state, action) => {
      state.currentUser = action.payload;
    },
    logoutUser: () => initialState,
  },
});

export const { setUserFromCookie, logoutUser } = authSlice.actions;
export default authSlice.reducer;
