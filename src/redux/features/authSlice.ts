import {createSlice} from "@reduxjs/toolkit";

export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
};

export interface UserState {
  isAuth: boolean;
  user: UserData | null;
  loading: boolean;
};

const initialState: UserState = {
  isAuth: false,
  user: null,
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: {type: string, payload: UserData}) => {
      state.isAuth = true;
      state.user = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(state.user));
    },
    logoutUser: (state) => {
      state.isAuth = false;
      state.user = null;
      localStorage.removeItem("user");
    }
  }
});

export const authReducer = authSlice.reducer;
export const {setCurrentUser, logoutUser} = authSlice.actions;