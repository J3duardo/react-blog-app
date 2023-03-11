import { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import CommentInput from "./CommentInput";
import SingleComment from "./SingleComment";
import { db } from "../../firebase";
import { AuthState } from "../../redux/store";
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
  const {user} = useSelector((state: AuthState) => state.auth);

  const [comments, setComments] = useState<CommentContent[]>([]);


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
            <CommentInput
              editMode={false}
              postId={postId}
              user={user}
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
      <Box className="blog-comment__comment-list" component="ul">
        <AnimatePresence initial={false}>
          {comments.map((comment) => {
            return (
              <Box
                key={comment.id}
                style={{padding: 0}}
                component={motion.li}
                initial={{height: 0, opacity: 0}}
                animate={{height: "auto", opacity: 1}}
                exit={{height: 0, opacity: 0}}
              >
                <SingleComment
                  data={comment}
                  currentUser={user}
                />
              </Box>
            )
          })}
        </AnimatePresence>
      </Box>
    </Box>
  )
};

export default BlogCommentInput;