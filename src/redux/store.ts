import {configureStore} from "@reduxjs/toolkit";
import {authReducer, UserData} from "./features/authSlice";

export interface AuthState {
  auth: {
    isAuth: boolean;
    user: UserData | null;
    loading: boolean;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});