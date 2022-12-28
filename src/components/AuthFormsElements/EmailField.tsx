import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {LoginFormFields} from "../../pages/Login";
import ValidationErrorMsg from "./ValidationErrorMsg";

const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface Props {
  disabled: boolean;
};

export const EmailField = ({disabled}: Props) => {
  const {register, formState: {errors}} = useFormContext<LoginFormFields>();

  const isInvalid = !!errors.email;

  return (
    <TextField
      className={`form__field ${isInvalid && "form__field--invalid"}`}
      variant="filled"
      label="Email"
      type="email"
      fullWidth
      disabled={disabled}
      InputProps={{disableUnderline: true}}
      InputLabelProps={{error: isInvalid}}
      helperText={isInvalid && <ValidationErrorMsg errorMsg={errors.email!.message as string} />}
      {
        ...register("email", {
          required: {value: true, message: "The email is required"},
          pattern: {value: emailRegexp, message: "Invalid email address"}
        })
      }
    />
  )
};