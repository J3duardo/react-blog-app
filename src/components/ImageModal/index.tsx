import {Dispatch, SetStateAction} from "react";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { LayoutState } from "../../redux/store";
import "./imageModal.css";

interface Props {
  image: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
};

const ImageModal = ({image, open, setOpen}: Props) => {
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      className="image-dialog"
      open={open}
      slotProps={{
        backdrop: {style: {backgroundColor: "rgba(0,0,0,0.9)"}}
      }}
      PaperProps={{
        style: {
          marginTop: `calc(${navbarHeight}px + var(--spacing-xl))`,
          backgroundColor: "transparent"
        }
      }}
      onClose={() => setOpen(false)}
    >
      <DialogContent className="image-dialog__content">
        <IconButton
          size="small"
          className="image-dialog__close-icon"
          onClick={() => setOpen(false)}
        >
          <FaTimes />
        </IconButton>
        <Box className="image-dialog__img-wrapper">
          <img className="image-dialog__img" src={image} alt="" />
        </Box>
      </DialogContent>
    </Dialog>
  )
};

export default ImageModal;