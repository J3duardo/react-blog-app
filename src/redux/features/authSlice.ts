import {createSlice} from "@reduxjs/toolkit";

export interface UserData {
  uid: string;
  displayName: string;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
};

export interface UserProfile {
  uid: string;
  name: string;
  lastname: string;
  email: string | null;
  emailVerified: boolean;
  avatar: string;
};

interface UserState {
  isAuth: boolean;
  user: UserData | null;
  profile: UserProfile | null;
  loading: boolean;
};

const initialState: UserState = {
  isAuth: false,
  user: null,
  profile: null,
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
    setCurrentProfile: (state, action: {type: string, payload: UserProfile}) => {
      state.profile = action.payload;
      localStorage.setItem("profile", JSON.stringify(action.payload));
    },
    setLoading: (state, action: {type: string, payload: boolean}) => {
      state.loading = action.payload
    },
    logoutUser: (state) => {
      state.isAuth = false;
      state.user = null;
      state.profile = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("profile");
    }
  }
});

export const authReducer = authSlice.reducer;
export const {setCurrentUser, setCurrentProfile, logoutUser, setLoading} = authSlice.actions;