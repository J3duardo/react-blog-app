import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { LayoutState } from "../redux/store";
import { Blog } from "../components/HomePage/BlogSection";
import { blogsCollection } from "../firebase";
import BlogMetadata from "../components/BlogMetadata";
import Spinner from "../components/Spinner";
import "../styles/blogDetailsPage.css";

const BlogDetails = () => {
  const {blogId} = useParams();
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);

  const [blogDetails, setBlogDetails] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if(!blogDetails && error) {
    return null
  };

  return (
    <Box
      style={{padding: `${navbarHeight}px 0`}}
      className="blog-detail"
      component="section"
    >
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

        <img
          className="blog-detail__img"
          src={blogDetails!.imageUrl}
          alt={blogDetails!.title}
        />
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