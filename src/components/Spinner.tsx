import {CSSProperties} from "react";
import {Box, CircularProgress} from "@mui/material";

const spinnerWrapperStyles: CSSProperties = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  zIndex: 10
};

const Spinner = () => {
  return (
    <Box style={spinnerWrapperStyles}>
      <CircularProgress style={{width: "50px", height: "50px"}} />
    </Box>
  );
};

export default Spinner;