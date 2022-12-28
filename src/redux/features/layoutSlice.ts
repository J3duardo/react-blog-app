import {createSlice} from "@reduxjs/toolkit";

interface LayoutState {
  navbarHeight: number;
}

const initialState: LayoutState = {
  navbarHeight: 0
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setNavbarHeight: (state, action: {type: string, payload: number}) => {
      state.navbarHeight = action.payload;
    }
  }
});

export const layoutReducer = layoutSlice.reducer;
export const {setNavbarHeight} = layoutSlice.actions;