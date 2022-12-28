import {CSSProperties} from "react";
import {Box, CircularProgress} from "@mui/material";

const spinnerWrapperStyles: CSSProperties = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  zIndex: 10
};

interface Props {
  containerHeight: string;
  spinnerWidth: string;
  spinnerHeight: string;
  spinnerColor: string;
}

const Spinner = ({containerHeight, spinnerWidth, spinnerHeight, spinnerColor}: Props) => {
  return (
    <Box style={{...spinnerWrapperStyles, height: containerHeight}}>
      <CircularProgress style={{
          width: spinnerWidth, 
          height: spinnerHeight,
          color: spinnerColor
        }}
      />
    </Box>
  );
};

export default Spinner;