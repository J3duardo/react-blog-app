import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { AiOutlineCamera } from "react-icons/ai";
import { LayoutState } from "../redux/store";
import { Blog } from "../components/HomePage/BlogSection";
import { blogsCollection } from "../firebase";
import BlogMetadata from "../components/BlogMetadata";
import Spinner from "../components/Spinner";
import "../styles/blogDetailsPage.css";
import ImageModal from "../components/ImageModal";

const BlogDetails = () => {
  const {blogId} = useParams();
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);

  const [blogDetails, setBlogDetails] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openImageModal, setOpenImageModal] = useState(false);

  // Cargar la data del blog
  useEffect(() => {
    setLoading(true);
    setError(null);

    const blogRef = doc(blogsCollection, blogId);

    getDoc(blogRef)
    .then((doc) => {
      const blogData = doc.data() as Blog;
      setBlogDetails(blogData);
    })
    .catch((err: any) => {
      console.log(err.message)
    })
    .finally(() => {
      setLoading(false)
    });
  }, [blogId]);

  if (!blogDetails && loading) {
    return (
      <Spinner
        containerHeight="100vh"
        spinnerColor="black"
        spinnerHeight="50px"
        spinnerWidth="50px"
      />
    )
  };

  if(!blogDetails && !loading) {
    return null
  };

  return (
    <Box
      style={{padding: `${navbarHeight}px 0`}}
      className="blog-detail"
      component="section"
    >
      <ImageModal
        image={blogDetails!.imageUrl}
        open={openImageModal}
        setOpen={setOpenImageModal}
      />

      <Box
        className="blog-detail__img-wrapper inner-wrapper-xl"
        style={{
          padding: 0,
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.75) 100%),
            url(${blogDetails!.imageUrl})
          `
        }}
      > 
        {/* Efecto blur de la imagen de fondo del banner */}
        <Box className="blog-detail__backdrop-blur"/>

        <Box className="blog-detail__img">
          <img
            src={blogDetails!.imageUrl}
            alt={blogDetails!.title}
          />
          <Tooltip title="Open image">
            <IconButton
              className="blog-detail__img__btn"
              size="small"
              onClick={() => setOpenImageModal(true)}
            >
              <AiOutlineCamera className="blog-detail__img__btn__icon" />
            </IconButton>
          </Tooltip>
          <Box className="blog-detail__img__overlay" />
        </Box>
      </Box>

      <Box className="blog-detail__content inner-wrapper--sm">
        <BlogMetadata
          name={blogDetails!.author.displayName}
          avatar={blogDetails!.author.photoURL}
          date={blogDetails!.createdAt}
        />

        <Divider style={{margin: "var(--spacing) 0"}} />

        <Typography className="blog-detail__title" variant="h3">
          {blogDetails!.title}
        </Typography>

        <Divider style={{marginBottom: "var(--spacing)"}} />

        <Typography className="blog-detail__description">
          {blogDetails!.description}
        </Typography>
      </Box>
    </Box>
  )
};

export default BlogDetails;