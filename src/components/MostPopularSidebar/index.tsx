import { MutableRefObject, useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BsFacebook, BsGithub } from "react-icons/bs";
import { AiFillBehanceCircle } from "react-icons/ai";
import PopularBlog from "./PopularBlog";
import PopularBlogSkeleton from "./PopularBlogSkeleton";
import CategoryChip from "../BlogCard/CategoryChip";
import useFetchPopularBlogs from "../../hooks/useFetchPopularBlogs";
import useCategories from "../../hooks/useCategories";
import { CategoryObj } from "../../utils/arrayOccurrencesCounter";
import useResizeObserver from "../../hooks/useResizeObserver";
import { setSidebarWidth } from "../../redux/features/layoutSlice";
import "./mostPopularSidebar.css";
import CategorySkeleton from "./CategorySkeleton";

interface Props {
  offset: {
    top: number,
    left: number,
    right: number
  };
  trendingCategories: CategoryObj[];
  loading: boolean;
};

const MostPopular = ({offset}: Props) => {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();
  
  // Cargar las categorías de la base de datos
  const {categories, loadingCategories} = useCategories();

  // Calcular el width del sidebar
  const {elemWidth} = useResizeObserver({
    elementRef: sidebarRef as MutableRefObject<HTMLElement>
  });

  // Actualizar el state global del layout
  // con el width calculado del sidebar
  useEffect(() => {
    dispatch(setSidebarWidth({sidebarWidth: elemWidth}));
    
    return () => {
      dispatch(setSidebarWidth({sidebarWidth: 0}));
    };
  }, [elemWidth]);


  // Consultar los blogs más populares
  const {loadingPopularBlogs, popularBlogs} = useFetchPopularBlogs();

  return (
    <Box
      ref={sidebarRef}
      style={{
        paddingTop: `calc(${offset.top}px + var(--spacing-sm))`,
        right: `${offset.left}px`
      }}
      className="sidebar"
      component="aside"
    >
      <Box className="sidebar__content custom-scrollbar">
        {loadingCategories && <CategorySkeleton />}

        {!loadingCategories &&
          <Box className="sidebar__tags">
            {categories.map((category) => {
              return <CategoryChip key={category} category={category} />
            })}
          </Box>
        }

        {loadingPopularBlogs &&
          <Box className="sidebar__popular-blogs">
            <PopularBlogSkeleton />
            <PopularBlogSkeleton />
            <PopularBlogSkeleton />
            <PopularBlogSkeleton />
          </Box>
        }

        {!loadingPopularBlogs &&
          <Box className="sidebar__popular-blogs">
            <Typography className="sidebar__main-title" variant="h5">
              Popular posts
            </Typography>
            
            {popularBlogs.map(blog => {
              return (
                <Link
                  key={blog.id}
                  className="sidebar__popular-blogs__link-item"
                  to={`/blog/${blog.id}`}
                >
                  <PopularBlog blogData={blog} />
                </Link>
              )
            })}
          </Box>
        }
      </Box>

      <Box className="sidebar__footer">
        <Typography variant="subtitle1">
          &copy;{new Date().getFullYear()}
        </Typography>
        <Typography variant="subtitle1">
          Desarrollado por Jesús Guzmán
        </Typography>

        <Box className="sidebar__footer__icons">
          <IconButton size="small">
            <a href="https://github.com/J3duardo" target="_blank">
              <BsGithub />
            </a>
          </IconButton>
          <IconButton size="small">
            <a href="https://www.behance.net/J3duardo" target="_blank">
              <AiFillBehanceCircle />
            </a>
          </IconButton>
          <IconButton size="small">
            <a href="https://es-es.facebook.com" target="_blank">
              <BsFacebook />
            </a>
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
};

export default MostPopular;