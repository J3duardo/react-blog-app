import { Typography } from "@mui/material";
import "./formField.css";

interface Props {
  errorMsg: string;
}

const ValidationErrorMsg = (props: Props) => {
  return (
    <Typography
      className="form-field__error-msg"
      variant="subtitle1"
      component="span"
    >
      {props.errorMsg}
    </Typography>
  )
}

export default ValidationErrorMsg;