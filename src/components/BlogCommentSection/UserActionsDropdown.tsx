import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { Menu, MenuItem, Divider } from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { doc, deleteDoc, collection, FirestoreError } from "firebase/firestore";
import { db } from "../../firebase";
import { generateFirestoreErrorMsg } from "../../utils/firebaseErrorMessages";
import { setOpen } from "../../redux/features/snackbarSlice";

interface Props {
  commentId: string;
  loading: boolean;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>
  setLoading: Dispatch<SetStateAction<boolean>>
  anchorElement: HTMLButtonElement | null
  setAnchorElement: Dispatch<SetStateAction<HTMLButtonElement | null>>
};

const UserActionsDropdown = ({commentId, loading, setLoading, setEditMode, anchorElement, setAnchorElement}: Props) => {
  const dispatch = useDispatch();


  /*-------------------------------------------*/
  // Funcionalidad para eliminar el comentario
  /*-------------------------------------------*/
  const deleteCommentHandler = async () => {
    try {
      setLoading(true);

      const commentRef = doc(collection(db, "blogComments"), commentId);
      await deleteDoc(commentRef);
      
    } catch (error: any) {
      let message = error.message;
      const err = error as FirestoreError;
      
      if (err.code) {
        message = generateFirestoreErrorMsg(err.code)
      };

      dispatch(setOpen({open: true, message}));

    } finally {
      setLoading(false);
      setAnchorElement(null);
    };
  };


  return (
    <Menu
      style={{padding: 0}}
      open={!!anchorElement}
      anchorEl={anchorElement}
      disableScrollLock
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      onClose={() => setAnchorElement(null)}
    >
      <MenuItem
        disabled={loading}
        onClick={() => {
          setEditMode(true);
          setAnchorElement(null);
        }}
      >
        <BiEdit style={{marginRight: "5px"}} />
        Edit
      </MenuItem>

      <Divider style={{margin: 0}} />

      <MenuItem
        disabled={loading}
        onClick={deleteCommentHandler}
      >
        <MdDeleteOutline style={{marginTop: "-10px"}} />
        Delete
      </MenuItem>
    </Menu>
  )
};

export default UserActionsDropdown;