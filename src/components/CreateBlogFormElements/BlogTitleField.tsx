import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";

const TITLE_REGEX = /^[A-Za-zÀ-ž0-9()\-\s]{6,50}$/;

interface Props {
  disabled: boolean;
};

export const BlogTitleField = ({disabled}: Props) => {
  const {register, formState: {errors}} = useFormContext();

  const isInvalid = !!errors.title;

  return (
    <TextField
      className={`form__field ${isInvalid && "form__field--invalid"}`}
      variant="filled"
      label="Blog Title"
      type="text"
      fullWidth
      disabled={disabled}
      InputProps={{disableUnderline: true}}
      InputLabelProps={{error: isInvalid}}
      helperText={isInvalid && <ValidationErrorMsg errorMsg={errors.title!.message as string} />}
      {...register("title", {
        required: {value: true, message: "The title is required"},
        minLength: {value: 6, message: "The title must contain at least 6 characters"},
        maxLength: {value: 50, message: "The title must contain maximum 50 characters"},
        pattern: {
          value: TITLE_REGEX,
          message: "The title must contain only alphanumeric characters, hyphens and parentheses"
        }
      })}
    />
  )
};