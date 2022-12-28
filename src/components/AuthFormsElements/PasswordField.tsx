import {useState} from "react";
import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {LoginFormFields} from "../../pages/Login";
import PasswordInputIcon from "./PasswordInputIcon";
import ValidationErrorMsg from "./ValidationErrorMsg";
import PasswordvalidationMsg from "./PasswordValidationMsg";

const passwordRegexp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?!.*[\s\n]).{6,50}/;
const invalidPasswordMsg = "The password must contain at least one uppercase, one lowercase, one number and one special character";

interface Props {
  withValidation?: boolean;
  disabled: boolean;
};

export const PasswordField = ({withValidation, disabled}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {register, watch, formState: {errors}} = useFormContext<LoginFormFields>();

  const isInvalid = !!errors.password;

  return (
    <TextField
      className={`form__field ${isInvalid && "form__field--invalid"}`}
      variant="filled"
      label="Password"
      type={passwordVisible ? "text" : "password"}
      fullWidth
      disabled={disabled}
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
      helperText={isInvalid && (withValidation ?
        <PasswordvalidationMsg password={watch("password")} />  :
        <ValidationErrorMsg errorMsg={errors.password!.message as string} />
      )}
      {
        ...register("password", {
          required: {value: true, message: "The password is required"},
          pattern: withValidation ? {value: passwordRegexp, message: invalidPasswordMsg} : undefined
        })
      }
    />
  )
};