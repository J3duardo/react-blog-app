import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {SignupFormFields} from "../../pages/Signup";
import ValidationErrorMsg from "./ValidationErrorMsg";

const NAME_REGEXP = /^[A-Za-zÀ-ž]{3,50}$/;

interface Props {
  fieldName: "name" | "lastname";
  label: string;
  disabled: boolean;
};

/**
 * Campo genérico de texto que sólo acepta letras con o sin diacríticas
 * sin espacios ni al principio, ni entre, ni al final del string.
 */
export const GenericTextField = ({fieldName, label, disabled}: Props) => {
  const {register, formState: {errors}} = useFormContext<SignupFormFields>();

  const isInvalid = !!errors[fieldName];

  return (
    <TextField
      className={`form__field ${isInvalid && "form__field--invalid"}`}
      variant="filled"
      label={label}
      type="text"
      fullWidth
      disabled={disabled}
      InputProps={{disableUnderline: true}}
      InputLabelProps={{error: isInvalid}}
      helperText={isInvalid && <ValidationErrorMsg errorMsg={errors[fieldName]!.message as string} />}
      {
        ...register(fieldName, {
          required: {value: true, message: `The ${fieldName} is required`},
          minLength: {value: 3, message: `The ${fieldName} must contain at least 3 characters`},
          maxLength: {value: 50, message: `The ${fieldName} must contain at most 50 characters`},
          pattern: {value: NAME_REGEXP, message: `The ${fieldName} can consist only of letters without whitespaces`}
        })
      }
    />
  )
};