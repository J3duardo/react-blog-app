import { useState, useEffect, useRef } from "react";
import { Box, TextField, Avatar, Typography, InputAdornment, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Picker from "@emoji-mart/react";
import facebookEmojisData from "@emoji-mart/data/sets/14/facebook.json";
import { BsEmojiSmile } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { addDoc, collection, FirestoreError, onSnapshot, orderBy, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import SingleComment from "./SingleComment";
import { db } from "../../firebase";
import { AuthState } from "../../redux/store";
import { setOpen } from "../../redux/features/snackbarSlice";
import { generateFirestoreErrorMsg } from "../../utils/firebaseErrorMessages";
import "./blogCommentSection.css";

interface Props {
  postId: string;
};

export interface CommentContent {
  id: string;
  postId: string;
  user: {
    userId: string,
    avatar: string | null,
    name: string
  };
  comment: string;
  createdAt: Timestamp;
};

const BlogCommentInput = ({postId}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch();
  const {user} = useSelector((state: AuthState) => state.auth);

  const [comments, setComments] = useState<CommentContent[]>([]);
  const [commentText, setCommentText] = useState("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  

  // Crear el cometario
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

      // Crear el comentario al presionar Enter sin la tecla shift
      if (e.key === "Enter" && !e.shiftKey && !isEmpty) {
        e.preventDefault();
        await addDoc(commentsRef, commentData);
        setCommentText("");
      };
      
      // Crear el comentario al clickear el botón
      if (clicked && !isEmpty) {
        await addDoc(commentsRef, commentData);
        setCommentText("");
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


  // Suscribirse/desuscribirse de la colección de comentarios del post
  useEffect(() => {
    const commentsRef = collection(db, "blogComments");

    const commentsQuery = query(
      commentsRef,
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const comment = {id: doc.id, ...doc.data()} as CommentContent;
        return comment;
      });

      setComments(docs);
    });

    return () => unsubscribe();

  }, []);


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
    <Box className="blog-comment-section">
      <Box className="blog-comment__divider">
        <Typography variant="body1" fontWeight={500}>
          {comments.length} comments
        </Typography>
      </Box>

      {/* Mostrar el campo del comentario si está logueado */}
      {user &&
        <>
          <Box className="blog-comment__input-box">
            <Avatar
              src={user.photoURL || ""}
              className="blog-comment__avatar"
              sizes="large"
            />

            {openEmojiPicker &&
              <>
                <Box
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
          </Box>

          <Typography
            style={{
              display: "block",
              width: "100%",
              marginTop: "5px",
              textAlign: "right",
              fontStyle: "italic",
              opacity: 0.85
            }}
            variant="subtitle1"
          >
            Shift + Enter to add a new line.
          </Typography>
        </>
      }

      {/* Lista de comentarios */}
      {comments.length > 0 &&
        <Box className="blog-comment__comment-list" component="section">
          {comments.map((comment) => {
            return (
              <SingleComment
                key={comment.id}
                data={comment}
                currentUser={user}
              />
            )
          })}
        </Box>
      }
    </Box>
  )
};

export default BlogCommentInput;