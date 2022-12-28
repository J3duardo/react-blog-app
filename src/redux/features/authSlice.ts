import {createSlice} from "@reduxjs/toolkit";

export interface UserData {
  uid: string;
  displayName: string;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
};

interface UserState {
  isAuth: boolean;
  user: UserData | null;
  loading: boolean;
}

const initialState: UserState = {
  isAuth: false,
  user: null,
  loading: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: {type: string, payload: UserData}) => {
      state.isAuth = true;
      state.user = action.payload;
      state.loading = false;
      localStorage.setItem("currentUser", JSON.stringify(state.user));
    },
    setLoading: (state, action: {type: string, payload: boolean}) => {
      state.loading = action.payload
    },
    logoutUser: (state) => {
      state.isAuth = false;
      state.user = null;
      localStorage.removeItem("currentUser");
    }
  }
});

export const authReducer = authSlice.reducer;
export const {setCurrentUser, logoutUser, setLoading} = authSlice.actions;