import {createSlice} from "@reduxjs/toolkit";

interface LayoutState {
  navbarHeight: number;
  pagePadding: {
    top: string,
    bottom: string
  }
}

const initialState: LayoutState = {
  navbarHeight: 0,
  pagePadding: {
    top: "0",
    bottom: "0"
  }
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setNavbarHeight: (state, action: {type: string, payload: number}) => {
      state.navbarHeight = action.payload;
    },
    setPagePadding: (state, action: {type: string, payload: {top: string, bottom: string}}) => {
      state.pagePadding.top = action.payload.top;
      state.pagePadding.bottom = action.payload.bottom
    }
  }
});

export const layoutReducer = layoutSlice.reducer;
export const {setNavbarHeight, setPagePadding} = layoutSlice.actions;