import { useState } from "react";
import { Box, Typography, Chip, Button, IconButton, Divider, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import "./blogCard.css";
import { deleteObject, ref, StorageError } from "firebase/storage";
import { deleteDoc, doc, FirestoreError } from "firebase/firestore";
import { AuthError } from "firebase/auth";
import { Blog } from "../HomePage/BlogSection";
import BlogMetadata from "../BlogMetadata";
import ConfirmModal from "../ConfirmModal";
import { UserData } from "../../redux/features/authSlice";
import { setOpen } from "../../redux/features/snackbarSlice";
import { db, storage } from "../../firebase";
import { generateFirebaseAuthErrorMsg, generateFirebaseStorageErrorMsg, generateFirestoreErrorMsg } from "../../utils/firebaseErrorMessages";

interface Props {
  blog: Blog;
  user: UserData | null
};

const BlogCard = ({blog, user}: Props) => {
  const {id, title, description, author, thumbUrl, categories, imageName, createdAt} = blog;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Funcionalidad para eliminar el blog
  const deleteBlogHandler = async () => {
    try {
      setDeleting(true);

      // Path de las imágenes del blog en el bucket
      const mainImagePath = `blogs/${author.uid}/${title}/${imageName}`;
      const previewImagePath = `blogs/${author.uid}/${title}/preview-${imageName}`;

      // Referencias de las imágenes del blog
      const mainImageRef = ref(storage, mainImagePath);
      const previewImageRef = ref(storage, previewImagePath);

      // Eliminar las imágenes
      await deleteObject(mainImageRef);
      await deleteObject(previewImageRef);

      // Eliminar el documento del blog en la DB
      await deleteDoc(doc(db, "blogs", id));

      dispatch(setOpen({open: true, message: "Blog deleted successfully"}));
      
    } catch (error: any) {
      let err: StorageError | AuthError | FirestoreError;
      let message: string;

      if(error.message.includes("storage")) {
        err = error as StorageError;
        message = generateFirebaseStorageErrorMsg(err.code);

        // Eliminar el documento de la DB
        deleteDoc(doc(db, "blogs", id));

      } else if (error.message.includes("auth")) {
        err = error as AuthError;
        message = generateFirebaseAuthErrorMsg(err.code);
        
        // Eliminar el documento de la DB
        deleteDoc(doc(db, "blogs", id));
        
      } else {
        err = error as FirestoreError;
        message = generateFirestoreErrorMsg(err.code);

        // Eliminar el documento de la DB
        deleteDoc(doc(db, "blogs", id));
      };
      
      dispatch(setOpen({open: true, message}));

    } finally {
      setDeleting(false);
      setOpenDeleteModal(false);
    }
  };

  return (
    <Box className="blog-card card-shadow">
      <ConfirmModal
        title="Delete this blog?"
        content="This action cannot be undone."
        loading={deleting}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        confirmAction={deleteBlogHandler}
      />

      <Box className="blog-card__img-wrapper">
        <img
          className="blog-card__img"
          src={thumbUrl}
          alt={`${title} thumb`}
        />
      </Box>

      <Box className="blog-card__content" textAlign="left">
        <Box className="blog-card__title-wrapper">
          <Typography className="blog-card__title" variant="h6">
            <Link to={`/blog/${id}`}>{title}</Link>
          </Typography>

          {/* Botones para editar y borrar el post */}
          {/* Sólo se muestran al autor del post */}
          {!!user && user.uid === author.uid &&
            <Box className="blog-card__author-actions">
              <Tooltip title="Edit blog" placement="right">
                <IconButton
                  size="small"
                  disabled={deleting}
                  onClick={() => navigate(`/blog/create?editBlog=${id}`)}
                >
                  <AiOutlineEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete blog" placement="right">
                <IconButton
                  size="small"
                  disabled={deleting}
                  onClick={() => setOpenDeleteModal(true)}
                >
                  <AiOutlineDelete />
                </IconButton>
              </Tooltip>
            </Box>
          }
        </Box>

        <Divider style={{margin: "5px 0"}} />
        
        <BlogMetadata
          name={author.displayName}
          avatar={author.photoURL}
          date={createdAt}
        />

        <Divider style={{margin: "5px 0 var(--spacing) 0"}} />

        <Box className="blog-card__categories">
          {categories.slice(0, 3).map(category => {
            return (
              <Chip
                key={category}
                variant="filled"
                label={category}
                size="small"
                color="primary"
              />
            )
          })}
        </Box>

        <Divider style={{margin: "5px 0"}} />

        <Box className="blog-card__description">
          <Box className="blog-card__description-overlay" />
          <Typography variant="body2">
            {description}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/blog/${id}`)}
        >
          Read more...
        </Button>
      </Box>
    </Box>
  )
};

export default BlogCard;