import { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, /*IconButton,*/ Typography } from "@mui/material";
import { useDispatch } from "react-redux";
// import { FaTimesCircle } from "react-icons/fa";
import { sendEmailVerification } from "firebase/auth";
import { setOpen } from "../../redux/features/snackbarSlice";
import { auth } from "../../firebase";

interface Props {
  setShowWarning: Dispatch<SetStateAction<boolean>>
}

const VerificationWarning = ({setShowWarning}: Props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  // Enviar el mensaje de verificación de email
  const onClickHandler = async () => {
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser!);
      setLoading(false);
    } catch (error: any) {
      console.log(`Error sending verification email`, error);

      dispatch(setOpen({
        open: true,
        message: "Error sending verification email. Try again."
      }))
    };

    dispatch(setOpen({
      open: true,
      message: "Verification email sent. Check your inbox."
    }))
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "var(--spacing-sm) 0",
        backgroundColor: "var(--mui-error)",
        color: "white",
        borderTop: "1px solid white"
      }}
    >
      <Box
        className="inner-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--spacing)",
          padding: "0 24px",
        }}
      >
        <Typography color="inherit">
          You must verify your email in order to create blogs.
        </Typography>
        <Button
          style={{color: "white", borderColor: "white"}}
          variant="outlined"
          size="small"
          disabled={loading}
          onClick={onClickHandler}
        >
          Send verification email
        </Button>
        {/* <IconButton
          style={{marginLeft: "auto"}}
          size="small"
          onClick={() => setShowWarning(false)}
        >
          <FaTimesCircle style={{fontSize: "1rem", color: "white"}} />
        </IconButton> */}
      </Box>
    </Box>
  )
}

export default VerificationWarning;