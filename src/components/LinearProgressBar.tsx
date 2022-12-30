import { Box, LinearProgress, Typography } from "@mui/material";

interface Props {
  uploadProgress: number | null;
};

const LinearProgressBar = ({uploadProgress}: Props) => {
  if(!uploadProgress) {
    return null;
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: "var(--spacing)"
      }}
    >
      <LinearProgress
        style={{flexGrow: 1}}
        color="info"
        variant="determinate"
        value={uploadProgress}
      />
      <Typography variant="subtitle1">
        {uploadProgress}%
      </Typography>
    </Box>
  )
};

export default LinearProgressBar;