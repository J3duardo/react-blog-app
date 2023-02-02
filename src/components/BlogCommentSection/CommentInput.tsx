import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import Picker from "@emoji-mart/react";
import facebookEmojisData from "@emoji-mart/data/sets/14/facebook.json";
import { BsEmojiSmile } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { addDoc, collection, doc, FirestoreError, serverTimestamp, setDoc } from "firebase/firestore";
import { UserData } from "../../redux/features/authSlice";
import { db } from "../../firebase";
import { generateFirestoreErrorMsg } from "../../utils/firebaseErrorMessages";
import { setOpen } from "../../redux/features/snackbarSlice";

interface Props {
  user: UserData;
  postId: string;
  editMode: boolean;
  defaultValue?: string;
  commentId?: string;
  setEditMode?: Dispatch<SetStateAction<boolean>>
};

const CommentInput = ({user, postId, editMode, defaultValue, commentId, setEditMode}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);


  /*-------------------------------*/
  // Crear/actualizar el comentario
  /*-------------------------------*/
  const onSubmitHandler = async (e: any, clicked=false) => {   
    if(!user) {
      return false
    };

    const isEmpty = commentText.trim().length === 0;

    try {
      setLoading(true);

      const commentsRef = collection(db, "blogComments");
      const commentData = {
        postId: postId,
        user: {
          userId: user.uid,
          avatar: user.photoURL,
          name: user.displayName
        },
        comment: commentText,
        createdAt: serverTimestamp()
      };

      // Crear o editar el comentario al presionar Enter sin la tecla shift
      if (e.key === "Enter" && !e.shiftKey && !isEmpty) {
        e.preventDefault();
        
        editMode ?
          await setDoc(doc(commentsRef, commentId), commentData) :
          await addDoc(commentsRef, commentData);

        setCommentText("");
        setEditMode?.(false);
      };
      
      // Crear o editar el comentario al clickear el botón
      if (clicked && !isEmpty) {
        editMode ?
        await setDoc(doc(commentsRef, commentId), commentData) :
        await addDoc(commentsRef, commentData);
        
        setCommentText("");
        setEditMode?.(false);
      };
      
    } catch (error: any) {
      let message = error.message;
      const err = error as FirestoreError;

      if(err.code) {
        message = generateFirestoreErrorMsg(err.code)
      };

      dispatch(setOpen({open: true, message}))
    } finally {
      setLoading(false)
    }
  };


  /*-------------------------------------------------------------------------*/
  // Usar el texto del comentario como value inicial si está en modo edición
  /*-------------------------------------------------------------------------*/
  useEffect(() => {
    // Cancelar al presionar la tecla Esc
    const cancelEditListener = (e: any) => {
      if (e.key === "Escape" && setEditMode) {
        setEditMode(false)
      }
    };

    if (editMode) {
      setCommentText(defaultValue!);
      window.addEventListener("keydown", cancelEditListener)
    };

    return () => window.removeEventListener("keydown", cancelEditListener)

  }, [editMode]);


  // Listener del evento keydown
  // para agregar una nueva línea de texto
  // al presionar shift + enter.
  useEffect(() => {
    window.addEventListener("keydown", onSubmitHandler);
    return () => window.removeEventListener("keydown", onSubmitHandler)
  }, [commentText]);

   // Listener del evento change del input
  const onChangeHandler = (e: any) => {
    const value = (e.target as HTMLInputElement).value;
    setCommentText(value);
  };


  // Listener del emoji picker
  const onEmojiPickerHandler = (emoji: any) => {
    setCommentText(prev => {
      return prev + emoji.native;
    })
  };

  return (
    <>
      {openEmojiPicker &&
        <>
          <Box
            style={{display: editMode ? "none" : "block"}}
            className="blog-comment__emoji-picker-overlay"
            onClick={() => setOpenEmojiPicker(false)}
          />
          <Box className="blog-comment__emoji-picker">
            <Picker
              data={facebookEmojisData}
              set="facebook"
              onEmojiSelect={(emoji: any) => onEmojiPickerHandler(emoji)}
            />
          </Box>
        </>
      }

      <TextField
        ref={inputRef}
        className="blog-comment__input-field"
        placeholder="Add comment..."
        multiline
        minRows={1}
        maxRows={6}
        value={commentText}
        disabled={loading}
        onChange={(e) => onChangeHandler(e)}
        onKeyDown={(e) => onChangeHandler(e)}
        InputProps={{
          endAdornment: (
            <Box className="blog-comment__input-adornments-wrapper">
              <InputAdornment style={{marginLeft: "3px"}} position="end">
                <IconButton
                  disabled={loading}
                  onClick={() => setOpenEmojiPicker(prev => !prev)}
                >
                  <BsEmojiSmile />
                </IconButton>
              </InputAdornment>
              <InputAdornment style={{marginLeft: 0}} position="end">
                <IconButton
                  disabled={loading || commentText.trim().length === 0}
                  onClick={(e) => onSubmitHandler(e, true)}
                >
                  <FiSend />
                </IconButton>
              </InputAdornment>
            </Box>
          )
        }}
      />
    </>
  )
};

export default CommentInput;