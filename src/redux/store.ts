import {configureStore} from "@reduxjs/toolkit";
import {authReducer, UserData} from "./features/authSlice";
import {layoutReducer} from "./features/layoutSlice";

export interface AuthState {
  auth: {
    isAuth: boolean;
    user: UserData | null;
    loading: boolean;
  }
};

export interface LayoutState {
  layout: {
    navbarHeight: number,
    pagePadding: {
      top: string,
      bottom: string
    }
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer
  }
});