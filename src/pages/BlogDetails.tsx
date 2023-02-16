import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { collection, doc, onSnapshot} from "firebase/firestore";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiExpand } from "react-icons/bi";
import NotFound from "./NotFound";
import ImageModal from "../components/ImageModal";
import ConfirmModal from "../components/ConfirmModal";
import BlogMetadata from "../components/BlogMetadata";
import CategoryChip from "../components/BlogCard/CategoryChip";
import BlogCommentSection from "../components/BlogCommentSection";
import { Blog } from "./Home";
import { deleteBlog, DeleteBlogConfig, updateBlogViews } from "../utils/blogCrudHandlers";
import { AuthState, LayoutState } from "../redux/store";
import { auth, blogsCollection, db } from "../firebase";
import { generateFirestoreErrorMsg } from "../utils/firebaseErrorMessages";
import { setOpen } from "../redux/features/snackbarSlice";
import "../styles/blogDetailsPage.css";

const BlogDetails = () => {
  const {blogId} = useParams();
  const navigate = useNavigate();
  const {isAuth, user} = useSelector((state: AuthState) => state.auth);
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);
  const dispatch = useDispatch();

  const [blogDetails, setBlogDetails] = useState<Blog | null>(null);
  const [blogViews, setBlogViews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [blogNotFound, setBlogNotFound] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const [showImageModalBtn, setShowImageModalBtn] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);


  /*--------------------------------------------------------------*/
  // Consultar la data del blog y actualizar el contador de views
  /*--------------------------------------------------------------*/
  useEffect(() => {
    // Hacer scroll al top al entrar a la página.
    window.scrollTo({top: 0});

    setLoading(true);
    setError(null);
    setBlogNotFound(false);

    const blogRef = doc(blogsCollection, blogId);
    const viewsRef = doc(collection(db, "blogViews"), blogId);

    setLoading(true);
    setError(null);
    setBlogNotFound(false);

    // Actualizar el contador de views del blog
    // y actualizar el state con el contador actualizado.
    updateBlogViews(blogRef, viewsRef, setBlogViews, setError);

    // Listener para consultar la data del blog en tiempo real
    const blogUnsubscribe = onSnapshot(blogRef,
      (blogSnapshot) => {
        if(!blogSnapshot.exists()) {
          setBlogNotFound(true);
          setLoading(false);
        };

        const blogData = blogSnapshot.data() as Blog;
        setBlogDetails({...blogData, id: blogSnapshot.id});
        setLoading(false);
      },
      (error) => {
        const msg = generateFirestoreErrorMsg(error.code);
        dispatch(setOpen({open: true, message: msg}));
        setError(msg);
        setLoading(false);
      }
    );

    return () => {
      blogUnsubscribe();
    };

  }, [blogId, user]);


  /*-------------------------------------*/
  // Funcionalidad para eliminar el blog
  /*-------------------------------------*/
  const deleteBlogHandler = async () => {
    const config: DeleteBlogConfig = {
      blogData: blogDetails!,
      dispatch
    };

    setDeleting(true);
    await deleteBlog(config);
    navigate("/", {replace: true});
  };


  /*-----------------------------------------------*/
  // Mostrar página not found si el blog no existe
  /*-----------------------------------------------*/
  if(!loading && !deleting && blogNotFound) {
    return <NotFound />
  };


  return (
    <Box
      style={{minHeight: `calc(100vh - ${navbarHeight}px)`}}
      className="blog-detail"
      component="section"
    >
      {/* Modal para confirmar la eliminación del blog */}
      <ConfirmModal
        title="Delete this blog?"
        content="This action cannot be undone."
        loading={deleting}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        confirmAction={deleteBlogHandler}
      />

      {/* Modal para mostrar la imagen del blog */}
      <ImageModal
        image={blogDetails?.imageUrl || ""}
        open={openImageModal}
        setOpen={setOpenImageModal}
      />
      
      {/* Mostrar spinner mientras carga */}
      {loading &&
        <Box className="blog-detail__spinner">
          <CircularProgress
            style={{
              width: "50px", 
              height: "50px",
              color: "black"
            }}
          />
        </Box>
      }

      {/* Mostrar el contenido de la página cuando termine de cargar */}
      {!loading && !blogNotFound &&
        <>
        {/* Imagen del blog */}
          <Box
            className="blog-detail__img-wrapper inner-wrapper-xl"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.75) 100%),
                url(${blogDetails!.imageUrl})
              `
            }}
          > 
            {/* Efecto blur de la imagen de fondo del banner */}
            <Box className="blog-detail__backdrop-blur"/>

            <Box className="blog-detail__img inner-wrapper--sm">
              <img
                src={blogDetails!.imageUrl}
                alt={blogDetails!.title}
                onLoad={() => setShowImageModalBtn(true)}
              />
              {showImageModalBtn &&
                <Tooltip title="View image">
                  <IconButton
                    className="blog-detail__img__btn"
                    size="medium"
                    onClick={() => setOpenImageModal(true)}
                  >
                    <BiExpand className="blog-detail__img__btn__icon" />
                  </IconButton>
                </Tooltip>
              }
              <Box className="blog-detail__img__overlay" />
            </Box>
          </Box>

          {/* Contenido y metadata del blog */}
          <Box className="blog-detail__content inner-wrapper--sm">
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <BlogMetadata
                name={blogDetails!.author.displayName}
                avatar={blogDetails!.author.photoURL}
                date={blogDetails!.createdAt}
              />
              
              {blogViews > 0 &&
                <Box className="blog-detail__views-counter">
                  {blogViews.toString().split("").map((char, i) => {
                    return (
                      <Typography key={i} className="blog-detail__views-counter__item">
                        {char}
                      </Typography>
                    )
                  })}
                  <Typography
                    style={{
                      marginLeft: "5px",
                      fontSize: "inherit",
                      fontWeight: 700
                    }}>
                    Views
                  </Typography>
                </Box>
              }

              {/* Botones de edición y eliminación del blog */}
              {isAuth && (auth.currentUser?.uid === blogDetails?.author.uid) &&
                <Box className="blog-detail__author-actions">
                  <Divider orientation="vertical" flexItem />

                  <Button
                    variant="text"
                    size="small"
                    startIcon={<AiOutlineEdit />}
                    onClick={() => navigate(`/blog/create?editBlog=${blogDetails?.id}`)}
                  >
                    Edit
                  </Button>

                  <Divider orientation="vertical" flexItem />

                  <Button
                    variant="text"
                    size="small"
                    color="error"
                    startIcon={<AiOutlineDelete />}
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </Box>
              }
            </Box>

            <Divider style={{margin: "var(--spacing) 0"}} />

            {/* Categorías del post */}
            <Box className="blog-detail__categories">
              {blogDetails!.categories.map(category => {
                return <CategoryChip key={category} category={category} />
              })}
            </Box>

            {/* Título del post */}
            <Typography className="blog-detail__title" variant="h1">
              {blogDetails!.title}
            </Typography>

            <Divider style={{marginBottom: "var(--spacing)"}} />

            {/* Contenido del post */}
            <Typography
              // className="blog-detail__content"
              dangerouslySetInnerHTML={{__html: blogDetails!.content}}
            />

            {/* Seccción de comentarios del post */}
            <BlogCommentSection postId={blogId!} />
          </Box>
        </>
      }
    </Box>
  )
};

export default BlogDetails;