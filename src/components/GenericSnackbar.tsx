import { useSelector, useDispatch } from "react-redux";
import { Snackbar, IconButton } from "@mui/material";
import { FaTimesCircle } from "react-icons/fa";
import { SnackbarState } from "../redux/store";
import { setOpen } from "../redux/features/snackbarSlice";

const GenericSnackbar = () => {
  const {open, message} = useSelector((state: SnackbarState) => state.snackbar);
  const dispatch = useDispatch();

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => dispatch(setOpen({open: false, message:""}))}
    >
    <FaTimesCircle style={{fontSize: "var(--text-small)"}} />
  </IconButton>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(setOpen({open: false, message: ""}))}
      message={message}
      action={action}
    />
  )
};

export default GenericSnackbar;