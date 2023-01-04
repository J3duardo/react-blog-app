import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {createTheme, ThemeProvider, StyledEngineProvider} from "@mui/material";
import App from "./App";
import {store} from "./redux/store";
import "./index.css";

const theme = createTheme({
  typography: {
    h1: {fontSize: "var(--heading-1)", lineHeight: "var(--line-height-titles)"},
    h2: {fontSize: "var(--heading-2)", lineHeight: "var(--line-height-titles)"},
    h3: {fontSize: "var(--heading-3)", lineHeight: "var(--line-height-titles)"},
    h4: {fontSize: "var(--heading-4)", lineHeight: "var(--line-height-titles)"},
    h5: {fontSize: "var(--heading-5)", lineHeight: "var(--line-height-titles)"},
    body1: {fontSize: "var(--paragraph)", lineHeight: "var(--line-height)"},
    body2: {fontSize: "var(--paragraph)", lineHeight: "var(--line-height)"},
    button: {fontSize: "var(--paragraph)"},
    subtitle1: {fontSize: "var(--text-small)"},
    allVariants: {
      fontFamily: "'Raleway', sans-serif",
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