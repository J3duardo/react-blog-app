import { useRef, useCallback, MouseEvent, Dispatch, SetStateAction } from "react";
import { Box, InputLabel, FormHelperText } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";
import { FaTimesCircle } from "react-icons/fa";
import { BsCardImage } from "react-icons/bs";

interface Props {
  imagePreview: string | null;
  setImage: Dispatch<SetStateAction<File | null>>
  disabled: boolean;
};

export const FileInput = ({imagePreview, setImage, disabled}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {register, setValue, formState: {errors}} = useFormContext();

  const {ref, ...rest} = register("image", {
    required: {value: true, message: "The image is required"},
    onChange: (e: InputEvent) => {
      const file = (e.target as HTMLInputElement).files;

      if(file) {
        setImage(file[0]);
        setValue("image", file[0]);
      };

      // Limpiar el ref del input luego de seleccionar la imagen
      // para restablecer el evento change del input.
      if(fileInputRef.current) {
        fileInputRef.current.value = ""
      };
    }
  });

  // Click handler del label para seleccionar la imagen
  const onClickHandler = useCallback((e: MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    return fileInputRef.current?.click;
  }, []);

  const isInvalid = !!errors.image;

  return (
    <Box
      component="div"
      width="100%"
      minHeight="50px"
      alignSelf="flex-start"
    >
      <InputLabel
        style={{
          position: "static",
          display: "inline-flex",
          alignItems: "center",
          height: "100%",
          padding: "var(--spacing-sm)",
          border: "1px solid grey",
          borderRadius: "5px",
          backgroundColor: isInvalid ? "rgba(255,0,0,0.12)" : "transparent",
          cursor: disabled ? "default" : "pointer"
        }}
        htmlFor="image"
        onClick={(e) => {
          if (disabled) return null;
          onClickHandler(e);
        }}
      >
        {imagePreview ? "Change image" : "Choose image"}
        <BsCardImage style={{marginLeft: "var(--spacing)", fontSize: "24px"}} />
      </InputLabel>
      <input
        ref={(input) => fileInputRef.current = input}
        style={{display: "none"}}
        type="file"
        id="image"
        disabled={disabled}
        accept="image/jpeg, image/jpg, image/png, image/webp"
        {...rest}
      />
      <FormHelperText>
        {isInvalid && <ValidationErrorMsg errorMsg={errors.image!.message as string} />}
      </FormHelperText>

      {imagePreview &&
        <Box className="create-blog__image-preview-wrapper">
          <FaTimesCircle
            style={{
              position: "absolute",
              display: disabled ? "none" : "block",
              top: "var(--spacing-sm)",
              right: "var(--spacing-sm)",
              fontSize: "24px",
              color: "var(--error)",
              cursor: "pointer"
            }}
            onClick={() => {
              setImage(null);
              setValue("image", undefined)
            }}
          />
          <img
            className="create-blog__image-preview"
            src={imagePreview}
            alt="Image preview"
          />
        </Box>
      }
    </Box>
  )
};