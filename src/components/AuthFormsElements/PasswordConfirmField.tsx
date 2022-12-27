import {useState} from "react";
import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {SignupFormFields} from "../../pages/Signup";
import PasswordInputIcon from "./PasswordInputIcon";
import ValidationErrorMsg from "./ValidationErrorMsg";

export const PasswordConfirmField = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {register, formState: {errors}} = useFormContext<SignupFormFields>();

  const isInvalid = !!errors.passwordConfirm;

  return (
    <TextField
      className={`form__field ${isInvalid && "form__field--invalid"}`}
      variant="filled"
      label="Confirm your password"
      type={passwordVisible ? "text" : "password"}
      fullWidth
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <PasswordInputIcon
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        )
      }}
      InputLabelProps={{error: isInvalid}}
      helperText={isInvalid && <ValidationErrorMsg errorMsg={errors.passwordConfirm!.message as string} />}
      {
        ...register("passwordConfirm", {
          required: {value: true, message: "You must confirm your password"}
        })
      }
    />
  )
};