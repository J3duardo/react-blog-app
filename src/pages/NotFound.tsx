import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineWarning } from "react-icons/ai";
import {MdOutlineArrowBack} from "react-icons/md";
import { LayoutState } from "../redux/store";
import "../styles/notFoundPage.css";

const NotFound = () => {
  const navigate = useNavigate();
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);

  return (
    <Box
      className="not-found"
      style={{padding: `${navbarHeight}px 0`}}
    >
      <Typography
        className="not-found__title"
        variant="body1"
      >
        Page not found!
      </Typography>

      <AiOutlineWarning className="not-found__icon" color="var(--error)" />

      <Button
        color="error"
        size="large"
        startIcon={<MdOutlineArrowBack />}
        onClick={() => navigate("/", {replace: true})}>
        Go back
      </Button>
    </Box>
  )
};

export default NotFound;