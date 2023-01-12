import {createSlice} from "@reduxjs/toolkit";

interface LayoutState {
  navbarHeight: number;
  sidebarWidth: number;
  pagePadding: {
    top: string,
    bottom: string
  }
}

const initialState: LayoutState = {
  navbarHeight: 0,
  sidebarWidth: 0,
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
    setSidebarWidth: (state, action: {type: string, payload: {sidebarWidth: number}}) => {
      state.sidebarWidth = action.payload.sidebarWidth;
    },
    setPagePadding: (state, action: {type: string, payload: {top: string, bottom: string}}) => {
      state.pagePadding.top = action.payload.top;
      state.pagePadding.bottom = action.payload.bottom
    }
  }
});

export const layoutReducer = layoutSlice.reducer;
export const {setNavbarHeight, setSidebarWidth, setPagePadding} = layoutSlice.actions;