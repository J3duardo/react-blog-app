import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogTitle, DialogActions, Button, DialogContent, Typography, Divider } from "@mui/material";

interface Props {
  title: string;
  content: string;
  open: boolean;
  loading: boolean;
  confirmAction: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>
};

const ConfirmModal = ({title, content, open, loading, confirmAction, setOpen}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>
        <Typography style={{fontSize: "var(--heading-5)"}} variant="body1">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          {content}
        </Typography>
      </DialogContent>

      <Divider />

      <DialogActions>
      <Button
          style={{textTransform: "capitalize"}}
          disabled={loading}
          onClick={() => setOpen(false)}
          >
          Cancel
        </Button>

        <Button
          style={{textTransform: "capitalize"}}
          color="error"
          disabled={loading}
          onClick={() => confirmAction()}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default ConfirmModal;