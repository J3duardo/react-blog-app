import { useEffect, Dispatch, SetStateAction } from "react";
import { Box, IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import "./imageModal.css";

interface Props {
  image: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
};

const ImageModal = ({image, open, setOpen}: Props) => {
  // Bloquear el scroll si el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";      
    }
  }, [open]);


  if(!open) {
    return null;
  };


  return (
    <Box className="image-modal" component="div" aria-modal>
      <Box
        className="image-modal__overlay"
        component="div"
        onClick={() => setOpen(false)}
      />

      <Box className="image-modal__content" component="div">
        <Box
          className="image-modal__img-wrapper"
          component="div"
        >
          <IconButton
            size="small"
            className="image-modal__close-icon"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </IconButton>
          <img
            className="image-modal__img"
            src={image}
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ImageModal;