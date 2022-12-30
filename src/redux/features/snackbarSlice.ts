import { createSlice } from "@reduxjs/toolkit";

interface SnackbarPayload {
  open: boolean;
  message: string;
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {open: false, message: ""},
  reducers: {
    setOpen: (state, action: {type: string, payload: SnackbarPayload}) => {
      state.open = action.payload.open;
      state.message = action.payload.message
    }
  }
});

export const snackbarReducer = snackbarSlice.reducer;
export const {setOpen} = snackbarSlice.actions;