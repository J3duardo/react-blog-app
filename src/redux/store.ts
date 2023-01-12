import {configureStore} from "@reduxjs/toolkit";
import {authReducer, UserData} from "./features/authSlice";
import {layoutReducer} from "./features/layoutSlice";
import {snackbarReducer} from "./features/snackbarSlice";

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
    sidebarWidth: number,
    pagePadding: {
      top: string,
      bottom: string
    }
  }
};

export interface SnackbarState {
  snackbar: {
    open: boolean,
    message: string
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    snackbar: snackbarReducer
  }
});