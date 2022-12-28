import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {createTheme, ThemeProvider, StyledEngineProvider} from "@mui/material";
import App from "./App";
import {store} from "./redux/store";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const theme = createTheme({
  typography: {
    h1: {fontSize: "var(--heading-1)"},
    h2: {fontSize: "var(--heading-2)"},
    h3: {fontSize: "var(--heading-3)"},
    h4: {fontSize: "var(--heading-4)"},
    h5: {fontSize: "var(--heading-5)"},
    body1: {fontSize: "var(--paragraph)"},
    button: {fontSize: "var(--paragraph)"},
    subtitle1: {fontSize: "var(--text-small)"},
    allVariants: {
      fontFamily: "'Noto Sans', sans-serif",
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);