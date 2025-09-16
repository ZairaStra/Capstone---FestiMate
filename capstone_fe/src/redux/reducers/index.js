import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  avatar: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.avatar = action.payload.avatar;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.avatar = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
