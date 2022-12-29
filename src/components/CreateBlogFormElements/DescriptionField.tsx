import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";

interface Props {
  disabled: boolean;
};

export const DescriptionField = ({disabled}: Props) => {
  const {register, formState: {errors}} = useFormContext();

  const isInvalid = !!errors.description;

  return (
    <TextField
      className={`form__field ${isInvalid && "form__field--invalid"}`}
      variant="filled"
      label="Description"
      type="text"
      fullWidth
      multiline
      minRows={3}
      maxRows={6}
      disabled={disabled}
      InputProps={{disableUnderline: true}}
      InputLabelProps={{error: isInvalid}}
      helperText={isInvalid && (
        <ValidationErrorMsg errorMsg={errors.description!.message as string} />
      )}
      {...register("description", {
        required: {value: true, message: "The description is required"},
        minLength: {value: 6, message: "The description must contain at least 6 characters"},
        maxLength: {value: 500, message: "The description must contain maximum 500 characters"}
      })}
    />
  )
};