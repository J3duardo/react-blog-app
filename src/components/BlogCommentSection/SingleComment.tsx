import { useState, useEffect } from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { BsChevronDown, BsDot } from "react-icons/bs";
import UserActionsDropdown from "./UserActionsDropdown";
import CommentInput from "./CommentInput";
import { CommentContent } from "./index";
import { UserData } from "../../redux/features/authSlice";
import { dateFormatter } from "../../utils/dateFormatter";
import { db } from "../../firebase";

interface Props {
  data: CommentContent;
  currentUser: UserData | null;
};

interface OnlineUser {
  userId: string;
  isOnline: boolean;
};

const SingleComment = ({data, currentUser}: Props) => {
  const {id, comment, postId, user: {userId, avatar, name}, createdAt} = data;

  const [loading, setLoading] = useState(false);
  const [isAuthorOnline, setIsAuthorOnline] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);


  /*---------------------------------------------------------------------*/
  // Actualizar el estado online del autor del comentario en tiempo real
  /*---------------------------------------------------------------------*/
  useEffect(() => {
    const onlineUserDocRef = doc(collection(db, "onlineUsers"), userId);

    const unsubscribe = onSnapshot(onlineUserDocRef, (snapshot) => {
      const {isOnline} = snapshot.data() as OnlineUser;
      setIsAuthorOnline(isOnline);
    });

    return () => unsubscribe();

  }, []);


  return (
    <Box
      style={{opacity: loading ? 0.5 : 1}}
      className="blog-comment__single-comment card-shadow"
      component="article"
    >
      {/*
        Mostrar el dropdown de editar y borrar
        si no está en modo edición y
        si es el autor del comentario
      */}
      {!editMode && (currentUser?.uid === userId) &&
        <Box className="blog-comment__user-actions">
          <IconButton
            size="small"
            onClick={(e) => setAnchorElement(e.currentTarget)}
          >
            <BsChevronDown />
          </IconButton>
        </Box>
      }

      {/* Dropdown de editar y borrar comentario */}
      <UserActionsDropdown
        commentId={id}
        loading={loading}
        editMode={editMode}
        setEditMode={setEditMode}
        setLoading={setLoading}
        anchorElement={anchorElement}
        setAnchorElement={setAnchorElement}
      />

      <Box className="blog-comment__single-comment__avatar-wrapper">
        <Avatar
          className="blog-comment__single-comment__avatar"
          src={avatar || ""}
        />
        <Box
          style={{backgroundColor: isAuthorOnline ? "green" : "#9b9b9b"}}
          className="blog-comment__single-comment__online-indicator"
        />
      </Box>

      {/* Mostrar el contenido del comentario si no está en modo edición */}
      {!editMode &&
        <Box className="blog-comment__single-comment__content">
          <Box className="blog-comment__single-comment__metadata">
            <Typography
              className="blog-comment__single-comment__username"
              variant="body1"
            >
              {name}
            </Typography>

            <BsDot />
            
            <Typography
              className="blog-comment__single-comment__date"
              variant="subtitle1"
            >
              {dateFormatter(createdAt)}
            </Typography>
          </Box>

          <Box className="blog-comment__single-comment__text">
            <Typography variant="body1">
              {comment}
            </Typography>
          </Box>
        </Box>
      }

      {/* Mostrar el input con el contenido del comentario si está en modo edición */}
      {editMode && currentUser &&
        <>
          <CommentInput
            postId={postId}
            user={currentUser}
            editMode={true}
            commentId={id}
            defaultValue={comment}
            setEditMode={setEditMode}
          />
          <Typography
            style={{
              position: "absolute",
              bottom: "10px",
              right: "var(--spacing-lg)",
              display: "block",
              width: "100%",
              textAlign: "right",
              fontStyle: "italic"
            }}
            variant="subtitle1"
          >
            Esc to cancel
          </Typography>
        </>
      }
    </Box>
  )
};

export default SingleComment;