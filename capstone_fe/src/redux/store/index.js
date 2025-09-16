import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/index";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
