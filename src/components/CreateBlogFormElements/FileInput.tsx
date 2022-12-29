import { useRef, useCallback, MouseEvent, Dispatch, SetStateAction } from "react";
import { Box, InputLabel, FormHelperText } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";
import { FaTimesCircle } from "react-icons/fa";
import { BsCardImage } from "react-icons/bs";

interface Props {
  imagePreview: string | null;
  setImage: Dispatch<SetStateAction<Blob | null>>
};

export const FileInput = ({imagePreview, setImage}: Props) => {
  const fileInputRef = useRef<null | HTMLInputElement>(null);

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
          cursor: "pointer"
        }}
        htmlFor="image"
        onClick={(e) => onClickHandler(e)}
      >
        {imagePreview ? "Change image" : "Choose image"}
        <BsCardImage style={{marginLeft: "var(--spacing)", fontSize: "24px"}} />
      </InputLabel>
      <input
        ref={(input) => fileInputRef.current = input}
        style={{display: "none"}}
        type="file"
        id="image"
        accept="image/jpeg, image/jpg, image/png"
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
              top: "var(--spacing-sm)",
              right: "var(--spacing-sm)",
              fontSize: "24px",
              color: "var(--mui-error)",
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